using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Models;
using FantasyApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ManagerController : ControllerBase
{
    private FantasyDbContext context { get; set; }
    private readonly FantasyPointsService fantasyPointsService;

    public ManagerController(FantasyDbContext context, FantasyPointsService fantasyPointsService)
    {
        this.context = context;
        this.fantasyPointsService = fantasyPointsService;
    }

    [HttpPost("StartRound")]
    public async Task<IActionResult> StartRound()
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.FantasyLeagues.ExecuteUpdateAsync(l =>
                l.SetProperty(x => x.IsRoundActive, true)
            );

            var leagueRound = await context.FantasyLeagues.FirstOrDefaultAsync();

            var teams = await context
                .FantasyTeams.Include(t => t.Players)
                .Include(t => t.Coach)
                .ToListAsync();

            var teamRounds = new List<FantasyTeamRound>();

            foreach (var team in teams)
            {
                var teamRound = new FantasyTeamRound
                {
                    Id = Guid.NewGuid(),
                    fantasyTeam = team,
                    round = leagueRound!.CurrentRound,
                    roundPoints = 0,
                    Coach = team.Coach!.FirstOrDefault()!,
                    Players = new List<FantasyPlayerRound>(),
                };

                foreach (var player in team.Players!)
                {
                    var playerRound = new FantasyPlayerRound
                    {
                        Id = Guid.NewGuid(),
                        fantasyPlayer = player,
                        //FantasyTeamRoundId = teamRound.Id,
                        roundPoints = 0,
                        round = leagueRound.CurrentRound,
                        Role = player.Role,
                    };

                    teamRound.Players.Add(playerRound);
                }

                teamRounds.Add(teamRound);
            }

            await context.FantasyTeamRounds.AddRangeAsync(teamRounds);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("EndRound")]
    public async Task<IActionResult> EndRound()
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var leagues = await context.FantasyLeagues.Where(l => l.IsRoundActive).ToListAsync();

            if (!leagues.Any())
                return Ok("Nema aktivnih liga");

            foreach (var league in leagues)
            {
                var currentRound = league.CurrentRound;

                var teams = await context
                    .FantasyTeams.Where(t => t.LeagueId == league.Id)
                    .ToListAsync();

                var teamIds = teams.Select(t => t.Id).ToList();

                var allPlayerRounds = await context
                    .FantasyPlayerRounds.Where(r =>
                        teamIds.Contains(r.fantasyPlayer!.FantasyTeamId) && r.round == currentRound
                    )
                    .Include(r => r.PlayerGameStats)
                    .ToListAsync();

                var allCoachRounds = await context
                    .FantasyCoachRounds.Where(r =>
                        teamIds.Contains(r.fantasyCoach!.FantasyTeamId) && r.round == currentRound
                    )
                    .Include(r => r.CoachGameStats)
                    .ToListAsync();

                var playerRoundsByTeam = allPlayerRounds
                    .GroupBy(r => r.fantasyPlayer!.FantasyTeamId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                var coachRoundsByTeam = allCoachRounds.ToDictionary(
                    r => r.fantasyCoach!.FantasyTeamId,
                    r => r
                );

                var teamRoundsToInsert = new List<FantasyTeamRound>();

                foreach (var team in teams)
                {
                    playerRoundsByTeam.TryGetValue(team.Id, out var playerRounds);
                    coachRoundsByTeam.TryGetValue(team.Id, out var coachRound);

                    double points = fantasyPointsService.CalculateTeamPoints(
                        playerRounds ?? new List<FantasyPlayerRound>(),
                        coachRound!
                    );

                    teamRoundsToInsert.Add(
                        new FantasyTeamRound
                        {
                            Id = Guid.NewGuid(),
                            fantasyTeam = team,
                            round = currentRound,
                            roundPoints = points,
                        }
                    );
                }

                await context.FantasyTeamRounds.AddRangeAsync(teamRoundsToInsert);

                league.IsRoundActive = false;
                league.CurrentRound += 1;
            }

            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"Greška: {ex.Message}");
        }
    }
}
