using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeam
{
    [Key]
    public Guid Id { get; set; }
    public Guid? LeagueId { get; set; }
    public string Name { get; set; }
    public List<FantasyTeamPlayer> Players { get; set; }
    public List<FantasyTeamCoach>? Coach { get; set; }
    public Person User { get; set; }
    public string? UserId { get; set; }
}