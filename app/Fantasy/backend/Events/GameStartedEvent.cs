namespace FantasyApi.Events;

public class GameStartedEvent
{
    public Guid GameId { get; set; }
    public Guid HomeTeamId { get; set; }
    public Guid GuestTeamId { get; set; }
    public string HomeTeamName { get; set; } = "";
    public string GuestTeamName { get; set; } = "";
    public int Round { get; set; }
    public DateTime DateTime { get; set; }
    public string Venue { get; set; } = "";
    public DateTime Timestamp { get; set; }
}