using FantasyApi.Data;

using FantasyApi.Enums;
using FantasyApi.Events;
using FantasyApi.Models;
using FantasyApi.Services;
using FantasyApi.Strategies;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Handlers;

public class GameEndedHandler
{
    private readonly FantasyDbContext _fantasyDb;
    private readonly FantasyPointsService _fantasyPointsService;

    public GameEndedHandler(
        FantasyDbContext fantasyDb,
        FantasyPointsService fantasyPointsService)
    {
        _fantasyDb = fantasyDb;
        _fantasyPointsService = fantasyPointsService;
    }

    public async Task HandleAsync(GameEndedEvent gameEvent)
    {
        if (!gameEvent.CoachStats.Any())
        {
            Console.WriteLine($"[Handler] No coach stats in GameEndedEvent for game {gameEvent.GameId}");
            return;
        }

        
        foreach (var coachSnapshot in gameEvent.CoachStats)
        {
            
            var coachStats = new CoachGameStats
            {
                Difference = coachSnapshot.Difference,
                CoachTechnicalFouls = coachSnapshot.CoachTechnicalFouls,
                BenchTechnicalFouls = coachSnapshot.BenchTechnicalFouls,
            };

           
            var fantasyTeamCoaches = await _fantasyDb.FantasyTeamCoaches
                .Include(ftc => ftc.FantasyTeam)
                .Where(ftc => ftc.CoachId == coachSnapshot.CoachId)
                .ToListAsync();

            foreach (var fantasyTeamCoach in fantasyTeamCoaches)
            {
                var fantasyTeam = fantasyTeamCoach.FantasyTeam;
                if (fantasyTeam == null) continue;

                var league = await _fantasyDb.FantasyLeagues
                    .FirstOrDefaultAsync(l => l.Id == fantasyTeam.LeagueId);

                if (league == null) continue;

                
                var coachRound = await _fantasyDb.FantasyCoachRounds
                    .Include(cr => cr.fantasyCoach)
                    .FirstOrDefaultAsync(cr =>
                        cr.fantasyCoach!.FantasyTeamId == fantasyTeam.Id &&
                        cr.fantasyCoach.CoachId == coachSnapshot.CoachId &&
                        cr.round == league.CurrentRound);

                if (coachRound == null)
                {
                    coachRound = new FantasyCoachRound
                    {
                        fantasyCoach = fantasyTeamCoach,
                        round = league.CurrentRound,
                        Role = FantasyRole.Coach,
                        CoachGameStats = coachStats,
                        roundPoints = 0
                    };
                    _fantasyDb.FantasyCoachRounds.Add(coachRound);
                }
                else
                {
                    coachRound.CoachGameStats = coachStats;
                }

               
                var strategy = StrategyFactory.GetStrategy(FantasyRole.Coach);
                coachRound.roundPoints = strategy.CalculatePoints(null, coachStats);

                await _fantasyDb.SaveChangesAsync();

                var dto = new CalculatePointsDto
                {
                    Id = coachSnapshot.CoachId,
                    Role = FantasyRole.Coach,
                    Points = coachRound.roundPoints,
                };

                await _fantasyPointsService.PushCoachPointsAsync(fantasyTeam.Id, dto);

                Console.WriteLine($"[Handler] Coach {coachSnapshot.CoachId} → team {fantasyTeam.Id}: {coachRound.roundPoints} pts (diff: {coachSnapshot.Difference})");
            }
        }
    }
}