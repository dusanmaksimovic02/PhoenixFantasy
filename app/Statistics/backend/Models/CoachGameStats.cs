namespace StatsApi.Models;

public class CoachGameStats
{
    public Game? Game { get; set; }
    public Coach? Coach { get; set; }

    public int? Difference { get; set; }
    public int? Pir { get; set; }
}