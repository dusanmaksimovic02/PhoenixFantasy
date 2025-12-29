namespace StatsApi.Models;

public class Game
{
    [Key]
    public string? Id { get; set; }
    public Team? HomeTeam { get; set; }
    public Team? GuestTeam { get; set; }
    public DateTime dateTime { get; set; }
    public string? Venue { get; set; }
    public Statistician? Statistician { get; set; }
}