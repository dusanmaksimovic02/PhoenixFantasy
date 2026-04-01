using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyLeague
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public FantasyUser leagueAdmin { get; set; }
    public List<FantasyTeam>? fantasyTeams { get; set; }
}