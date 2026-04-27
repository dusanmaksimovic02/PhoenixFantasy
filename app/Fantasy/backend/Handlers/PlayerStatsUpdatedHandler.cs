using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Events;
using FantasyApi.Models;
using FantasyApi.Services;
using FantasyApi.Strategies;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Handlers;

public class PlayerStatsUpdatedHandler
{
    private readonly FantasyDbContext _fantasyDb;
    private readonly FantasyPointsService _fantasyPointsService;

    public PlayerStatsUpdatedHandler(
        FantasyDbContext fantasyDb,
        FantasyPointsService fantasyPointsService
    )
    {
        _fantasyDb = fantasyDb;
        _fantasyPointsService = fantasyPointsService;
    }

    public async Task HandleAsync(PlayerStatsUpdatedEvent statsEvent)
    {
        var fantasyTeamPlayers = await _fantasyDb
            .FantasyTeamPlayers.Include(ftp => ftp.FantasyTeam)
            .Where(ftp => ftp.PlayerId == statsEvent.PlayerId)
            .ToListAsync();

        if (!fantasyTeamPlayers.Any())
        {
            Console.WriteLine($"[Handler] No fantasy teams have player {statsEvent.PlayerId}");
            return;
        }

        foreach (var fantasyTeamPlayer in fantasyTeamPlayers)
        {
            var fantasyTeam = fantasyTeamPlayer.FantasyTeam;
            if (fantasyTeam == null)
                continue;

            var league = await _fantasyDb.FantasyLeagues.FirstOrDefaultAsync(l =>
                l.Id == fantasyTeam.LeagueId
            );

            if (league == null || !league.IsRoundActive)
                continue;

            // var role =
            //     fantasyTeamPlayer.Position != null
            //         ? Enum.Parse<FantasyRole>(fantasyTeamPlayer.Position)
            //         : FantasyRole.Bench;

            var role = fantasyTeamPlayer.Role;

            var playerStats = new PlayerGameStats
            {
                Pir = statsEvent.Pir,
                Points = statsEvent.Points,
                Made1p = statsEvent.Made1p,
                Miss1p = statsEvent.Miss1p,
                Made2p = statsEvent.Made2p,
                Miss2p = statsEvent.Miss2p,
                Made3p = statsEvent.Made3p,
                Miss3p = statsEvent.Miss3p,
                Assists = statsEvent.Assists,
                Rebounds = statsEvent.Rebounds,
                OffensiveRebounds = statsEvent.OffensiveRebounds,
                DefensiveRebounds = statsEvent.DefensiveRebounds,
                Steals = statsEvent.Steals,
                Blocks = statsEvent.Blocks,
                RecievedBlocks = statsEvent.RecievedBlocks,
                Turnovers = statsEvent.Turnovers,
                PersonalFouls = statsEvent.PersonalFouls,
                RecievedFouls = statsEvent.RecievedFouls,
                TechnicalFouls = statsEvent.TechnicalFouls,
                SecondsPlayed = statsEvent.SecondsPlayed,
                IsStarter = statsEvent.IsStarter,
            };

            Console.WriteLine($"[RABBITMQ] Primljena statistika {statsEvent}");

            var playerRound = await _fantasyDb
                .FantasyPlayerRounds.Include(pr => pr.fantasyPlayer)
                .FirstOrDefaultAsync(pr =>
                    pr.fantasyPlayer!.FantasyTeamId == fantasyTeam.Id
                    && pr.fantasyPlayer.PlayerId == fantasyTeamPlayer.PlayerId
                    && pr.round == league.CurrentRound
                );

            if (playerRound == null)
            {
                playerRound = new FantasyPlayerRound
                {
                    fantasyPlayer = fantasyTeamPlayer,
                    round = league.CurrentRound,
                    Role = role,
                    // PlayerGameStats = playerStats,
                    roundPoints = 0,
                };
                _fantasyDb.FantasyPlayerRounds.Add(playerRound);
            }
            else
            {
                // playerRound.PlayerGameStats = playerStats;
            }

            var strategy = StrategyFactory.GetStrategy(playerRound.Role);
            playerRound.roundPoints = strategy.CalculatePoints(playerStats, null);

            var playerRounds = await _fantasyDb
                .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
                .Where(x =>
                    x.fantasyPlayer!.FantasyTeamId == fantasyTeam.Id
                    && x.round == league.CurrentRound
                )
                .ToListAsync();

            var coachRound = await _fantasyDb
                .FantasyCoachRounds.Include(x => x.fantasyCoach)
                .FirstOrDefaultAsync(x => x.fantasyCoach!.FantasyTeamId == fantasyTeam.Id);

            var totalPoints = _fantasyPointsService.CalculateTeamPoints(playerRounds, coachRound!);

            var teamRound = await _fantasyDb
                .FantasyTeamRounds.Include(t => t.fantasyTeam)
                .FirstOrDefaultAsync(t =>
                    t.fantasyTeam!.Id == fantasyTeam.Id && t.round == league.CurrentRound
                );

            teamRound!.roundPoints = totalPoints;

            await _fantasyDb.SaveChangesAsync();

            var dto = new CalculatePointsDto
            {
                Id = statsEvent.PlayerId,
                Role = playerRound.Role,
                Points = playerRound.roundPoints,
            };

            await _fantasyPointsService.PushPlayerPointsAsync(fantasyTeam.Id, dto);

            Console.WriteLine(
                $"[Handler] Player {statsEvent.PlayerId} → team {fantasyTeam.Id}: {playerRound.roundPoints} pts"
            );
        }
    }
}
