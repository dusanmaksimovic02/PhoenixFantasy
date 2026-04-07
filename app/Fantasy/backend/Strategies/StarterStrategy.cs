using FantasyApi.Interfaces;
using FantasyApi.Models;

namespace FantasyApi.Strategies;

public class StarterStrategy : IPointsCalculationStrategy
{
    public double CalculatePoints(PlayerGameStats? playerStats, CoachGameStats? coachStats)
    {
        if (playerStats == null)
            return 0;
        return (double)playerStats.Pir!;
    }
}
