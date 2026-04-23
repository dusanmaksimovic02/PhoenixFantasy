using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeamRound
{
    [Key]
    public Guid Id { get; set; }
    public FantasyTeam? fantasyTeam { get; set; }
    public List<FantasyPlayerRound>? Players { get; set; }
    public FantasyTeamCoach? Coach { get; set; }
    public int round { get; set; } = 1;
    public double roundPoints { get; set; } = 0;
}
