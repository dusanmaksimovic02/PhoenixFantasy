using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ManagerController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public ManagerController(FantasyDbContext context)
    {
        this.context = context;
    }

    [HttpPost("StartRound/{leagueId}")]
    public async Task<IActionResult> StartRound()
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.FantasyLeagues.ExecuteUpdateAsync(l =>
                l.SetProperty(x => x.IsRoundActive, true)
            );

            var leagueRound = await context.FantasyLeagues.FirstOrDefaultAsync();

            var teams = await context.FantasyTeams.Include(t => t.Players).ToListAsync();

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
        catch
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Greška prilikom startovanja runde");
        }
    }

    [HttpPost("EndRound/{leagueId}")]
    public async Task<IActionResult> EndRound()
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await context.FantasyLeagues.ExecuteUpdateAsync(l =>
                l.SetProperty(x => x.IsRoundActive, false)
                    .SetProperty(x => x.CurrentRound, x => x.CurrentRound + 1)
            );
            await transaction.CommitAsync();
            return Ok();
        }
        catch
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Greška prilikom startovanja runde");
        }
    }
}
