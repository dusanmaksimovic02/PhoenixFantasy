public class PlayerStatsDto
{
    public Guid PlayerId { get; set; }

    public string? JerseyNumber { get; set; }
    public string FullName { get; set; } = string.Empty;

    public double Points { get; set; }
    public double Assists { get; set; }
    public double Rebounds { get; set; }
    public double Steals { get; set; }
    public double Turnovers { get; set; }
    public double Blocks { get; set; }
    public double PersonalFouls { get; set; }
    public double Pir { get; set; }

    public ShotStatDto FreeThrow { get; set; } = new();
    public ShotStatDto TwoPoint { get; set; } = new();
    public ShotStatDto ThreePoint { get; set; } = new();
}

public class ShotStatDto
{
    public int Made { get; set; }
    public int Missed { get; set; }
    public int Total => Made + Missed;

    public double Percentage => Total == 0 ? 0 : (double)Made / Total * 100;
}
