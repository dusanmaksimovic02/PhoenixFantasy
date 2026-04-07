using FantasyApi.Interfaces;
using FantasyApi.Models;
using FantasyApi.Enums;

namespace FantasyApi.Strategies;

public static class StrategyFactory
{
    public static IPointsCalculationStrategy GetStrategy(FantasyRole role)
    {
        return role switch
        {
            FantasyRole.Captain => new CaptainStrategy(),
            FantasyRole.Starter => new StarterStrategy(),
            FantasyRole.Bench => new BenchStrategy(),
            FantasyRole.Coach => new CoachStrategy(),
            _ => throw new Exception("Unknown role"),
        };
    }
}
