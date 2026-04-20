using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Hubs;
using FantasyApi.Models;
using FantasyApi.Strategies;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class FantasyPointsService
{
    private readonly IHubContext<FantasyHub> _hubContext;

    public FantasyPointsService(IHubContext<FantasyHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public double CalculateTeamPoints(
        List<FantasyPlayerRound> playerRounds,
        FantasyCoachRound coachRound
    )
    {
        double totalPoints = 0;

        foreach (var round in playerRounds)
        {
            var strategy = StrategyFactory.GetStrategy(round.Role);

            double points = strategy.CalculatePoints(round.PlayerGameStats, null);

            totalPoints += points;
        }

        if (coachRound != null)
        {
            var coachStrategy = StrategyFactory.GetStrategy(FantasyRole.Coach);

            double coachPoints = coachStrategy.CalculatePoints(null, coachRound.CoachGameStats);

            totalPoints += coachPoints;
        }

        return totalPoints;
    }

    public async Task<List<CalculatePointsDto>> CalculatePlayerPointsAsync(
        Guid fantasyTeamId,
        List<FantasyPlayerRound> playerRounds,
        FantasyCoachRound coachRound
    )
    {
        var result = new List<CalculatePointsDto>();

        foreach (var round in playerRounds)
        {
            var strategy = StrategyFactory.GetStrategy(round.Role);

            double points = strategy.CalculatePoints(round.PlayerGameStats, null);

            var dto = new CalculatePointsDto
            {
                Id = round.fantasyPlayer!.PlayerId,
                Role = round.Role,
                Points = points,
            };

            result.Add(dto);

            await _hubContext
                .Clients.Group(fantasyTeamId.ToString())
                .SendAsync("PlayerPointsUpdated", dto);
        }

        if (coachRound != null)
        {
            var strategy = StrategyFactory.GetStrategy(FantasyRole.Coach);

            double points = strategy.CalculatePoints(null, coachRound.CoachGameStats);

            var dto = new CalculatePointsDto
            {
                Id = coachRound.fantasyCoach!.CoachId,
                Role = FantasyRole.Coach,
                Points = points,
            };

            result.Add(dto);

            await _hubContext
                .Clients.Group(fantasyTeamId.ToString())
                .SendAsync("CoachPointsUpdated", dto);
        }

        return result;
    }
}
