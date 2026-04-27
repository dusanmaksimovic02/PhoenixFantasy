using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Events;
using FantasyApi.Hubs;
using FantasyApi.Models;
using FantasyApi.Services;
using FantasyApi.Strategies;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Handlers;

public class GameEndedHandler
{
    private readonly FantasyDbContext _fantasyDb;
    private readonly FantasyPointsService _fantasyPointsService;
    private readonly IHubContext<GameScoreHub> _hubContext;

    public GameEndedHandler(
        FantasyDbContext fantasyDb,
        FantasyPointsService fantasyPointsService,
        IHubContext<GameScoreHub> hubContext
    )
    {
        _fantasyDb = fantasyDb;
        _fantasyPointsService = fantasyPointsService;
        _hubContext = hubContext;
    }

    public async Task HandleAsync(GameEndedEvent gameEvent)
    {
        if (!gameEvent.CoachStats.Any())
            return;

        var pushTasks = new List<Task>();

        foreach (var coachSnapshot in gameEvent.CoachStats)
        {
            var tempCoachStats = new CoachGameStats
            {
                Difference = coachSnapshot.Difference,
                CoachTechnicalFouls = coachSnapshot.CoachTechnicalFouls,
                BenchTechnicalFouls = coachSnapshot.BenchTechnicalFouls,
            };

            var strategy = StrategyFactory.GetStrategy(FantasyRole.Coach);
            double calculatedPoints = strategy.CalculatePoints(null, tempCoachStats);

            var fantasyTeamCoaches = await _fantasyDb
                .FantasyTeamCoaches.AsNoTracking()
                .Where(ftc => ftc.CoachId == coachSnapshot.CoachId)
                .ToListAsync();

            foreach (var fantasyTeamCoach in fantasyTeamCoaches)
            {
                var league = await _fantasyDb
                    .FantasyLeagues.AsNoTracking()
                    .Where(l =>
                        _fantasyDb
                            .FantasyTeams.Where(t => t.Id == fantasyTeamCoach.FantasyTeamId)
                            .Select(t => t.LeagueId)
                            .Contains(l.Id)
                    )
                    .FirstOrDefaultAsync();

                if (league == null)
                    continue;

                await _fantasyDb
                    .FantasyCoachRounds.Where(cr =>
                        cr.fantasyCoach!.FantasyTeamId == fantasyTeamCoach.FantasyTeamId
                        && cr.fantasyCoach.CoachId == coachSnapshot.CoachId
                        && cr.round == league.CurrentRound
                    )
                    .ExecuteDeleteAsync();

                await _fantasyDb.Database.ExecuteSqlRawAsync(
                    @"INSERT INTO FantasyCoachRounds (Id, fantasyCoachFantasyTeamId, fantasyCoachCoachId, round, Role, roundPoints)
      VALUES ({0}, {1}, {2}, {3}, {4}, {5})",
                    Guid.NewGuid(),
                    fantasyTeamCoach.FantasyTeamId,
                    fantasyTeamCoach.CoachId,
                    league.CurrentRound,
                    (int)FantasyRole.Coach,
                    calculatedPoints
                );

                var playerRounds = await _fantasyDb
                    .FantasyPlayerRounds.AsNoTracking()
                    .Include(p => p.fantasyPlayer)
                    .Where(x =>
                        x.fantasyPlayer!.FantasyTeamId == fantasyTeamCoach.FantasyTeamId
                        && x.round == league.CurrentRound
                    )
                    .ToListAsync();

                var mockCoachRound = new FantasyCoachRound { roundPoints = calculatedPoints };
                var totalPoints = _fantasyPointsService.CalculateTeamPoints(
                    playerRounds,
                    mockCoachRound
                );

                await _fantasyDb
                    .FantasyTeamRounds.Include(t => t.fantasyTeam)
                    .Where(t =>
                        t.fantasyTeam!.Id == fantasyTeamCoach.FantasyTeamId
                        && t.round == league.CurrentRound
                    )
                    .ExecuteUpdateAsync(s => s.SetProperty(p => p.roundPoints, totalPoints));

                pushTasks.Add(
                    _fantasyPointsService.PushCoachPointsAsync(
                        fantasyTeamCoach.FantasyTeamId,
                        new CalculatePointsDto
                        {
                            Id = coachSnapshot.CoachId,
                            Role = FantasyRole.Coach,
                            Points = calculatedPoints,
                        }
                    )
                );

                Console.WriteLine(
                    $"[Handler] Coach {coachSnapshot.CoachId} → team {fantasyTeamCoach.FantasyTeamId}: {calculatedPoints} pts"
                );
            }
        }

        await _fantasyPointsService.PushLeaderboard();

        await Task.WhenAll(pushTasks);

        
        var gameEndedPayload = new
        {
            gameId = gameEvent.GameId,
            homeTeamId = gameEvent.HomeTeamId,
            guestTeamId = gameEvent.GuestTeamId,
            homeTeamScore = gameEvent.HomeTeamScore,
            guestTeamScore = gameEvent.GuestTeamScore,
            gameEnded = true,
        };

        await _hubContext
            .Clients.Group(gameEvent.HomeTeamId.ToString())
            .SendAsync("GameEnded", gameEndedPayload);
        await _hubContext
            .Clients.Group(gameEvent.GuestTeamId.ToString())
            .SendAsync("GameEnded", gameEndedPayload);
            
        await _hubContext.Clients.Group(gameEvent.GameId.ToString())
            .SendAsync("GameEnded", gameEndedPayload);

        Console.WriteLine($"[Handler] Game {gameEvent.GameId} ended — SignalR notified both teams");
    }
}