using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Models;
using FantasyApi.Strategies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class FantasyPointsService
{
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
}
