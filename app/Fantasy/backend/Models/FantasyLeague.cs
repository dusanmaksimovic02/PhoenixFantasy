using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyLeague
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Person? leagueAdmin { get; set; }
    public string? leagueAdminId { get; set; }
    public List<FantasyTeam>? fantasyTeams { get; set; }
    public required string LeagueName { get; set; }
    public string? JoinCode { get; set; }
}
