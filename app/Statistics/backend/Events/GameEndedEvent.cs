namespace StatsApi.Events;

public class GameEndedEvent
{
    public Guid GameId { get; set; }
    public Guid HomeTeamId { get; set; }
    public Guid GuestTeamId { get; set; }
    public string HomeTeamName { get; set; } = "";
    public string GuestTeamName { get; set; } = "";
    public int HomeTeamScore { get; set; }
    public int GuestTeamScore { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
    public List<CoachStatsSnapshot> CoachStats { get; set; } = new();
    public bool GameEnded { get; set; } = true;
}

public class CoachStatsSnapshot
{
    public Guid CoachId { get; set; }
    public Guid TeamId { get; set; }
    public int Difference { get; set; }
    public int CoachTechnicalFouls { get; set; }
    public int BenchTechnicalFouls { get; set; }
}