namespace FantasyApi.Events;

public class GameScoreUpdatedEvent
{
    public Guid GameId { get; set; }
    public string HomeTeamName { get; set; } = "";
    public string GuestTeamName { get; set; } = "";
    public Guid HomeTeamId { get; set; }
    public Guid GuestTeamId { get; set; }
    public int HomeTeamScore { get; set; }
    public int GuestTeamScore { get; set; }
    public DateTime Timestamp { get; set; }
}