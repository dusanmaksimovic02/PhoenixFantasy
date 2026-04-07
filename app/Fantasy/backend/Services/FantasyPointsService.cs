using FantasyApi.Data;
using FantasyApi.Models;
using FantasyApi.Strategies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class FantasyPointsService
{
    public double CalculateTeamPoints(List<FantasyTeamPlayer> players, FantasyTeamCoach coach)
    {
        double totalPoints = 0;

        foreach (var player in players)
        {
            var strategy = StrategyFactory.GetStrategy(player.Role);

            double points = strategy.CalculatePoints(player.PlayerGameStats, coach.CoachGameStats);

            totalPoints += points;
        }

        return totalPoints;
    }
}
