using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeam
{
    [Key]
    public Guid Id { get; set; }
    public Guid? LeagueId { get; set; }
    public string? UserId { get; set; }
    public string Name { get; set; }
    public FantasyPlayer? fantasyPlayerCaptain { get; set; }
    public List<FantasyPlayer>? fantasyPlayersStart { get; set; }
    public List<FantasyPlayer>? fantasyPlayersBench { get; set; }
    public List<FantasyCoach>? fantasyCoach { get; set; }
}