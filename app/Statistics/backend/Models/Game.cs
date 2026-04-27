using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Game
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Team? HomeTeam { get; set; }
    public Team? GuestTeam { get; set; }
    public DateTime dateTime { get; set; }
    public string? Venue { get; set; }
    public Person? Referee { get; set; }
    public int? Round { get;set; }
    public int HomeTeamScore { get;set; }
    public int GuestTeamScore { get;set; }

    public bool? GameEnded{get; set; } = false;
}