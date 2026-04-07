using FantasyApi.Models;

namespace FantasyApi.Interfaces;

public interface IPointsCalculationStrategy
{
    double CalculatePoints(PlayerGameStats? playerStats, CoachGameStats? coachStats);
}
