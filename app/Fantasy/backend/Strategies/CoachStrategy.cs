using FantasyApi.Interfaces;
using FantasyApi.Models;

namespace FantasyApi.Strategies;

public class CoachStrategy : IPointsCalculationStrategy
{
    public double CalculatePoints(PlayerGameStats? playerStats, CoachGameStats? coachStats)
    {
        if (coachStats == null)
            return 0;
        return (double)coachStats.Difference!;
    }
}
