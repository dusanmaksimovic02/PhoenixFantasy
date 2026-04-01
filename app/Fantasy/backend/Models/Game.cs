using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class Game
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Team? HomeTeam { get; set; }
    public Team? GuestTeam { get; set; }
    public DateTime dateTime { get; set; }
    public string? Venue { get; set; }
    public Guid? Referee { get; set; }
    public int? Round { get;set; }
}