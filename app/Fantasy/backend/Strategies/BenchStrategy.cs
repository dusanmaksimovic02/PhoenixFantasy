using FantasyApi.Interfaces;
using FantasyApi.Models;

namespace FantasyApi.Strategies;

public class BenchStrategy : IPointsCalculationStrategy
{
    public double CalculatePoints(PlayerGameStats? playerStats, CoachGameStats? coachStats)
    {
        if (playerStats == null)
            return 0;
        return (double)(playerStats.Pir! * 0.5);
    }
}
