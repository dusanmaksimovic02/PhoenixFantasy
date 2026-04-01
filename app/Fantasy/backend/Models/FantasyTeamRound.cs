using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeamRound
{
    [Key]
    public Guid Id { get; set; }
    public FantasyTeam fantasyTeam { get; set; }
    public FantasyPlayer? fantasyPlayerCaptain { get; set; }
    public List<FantasyPlayer>? fantasyPlayersStart { get; set; }
    public List<FantasyPlayer>? fantasyPlayersBench { get; set; }
    public FantasyCoach? fantasyCoach { get; set; }
    public int round{ get; set; } = 1;
    public double roundPoints { get; set; } = 0 ;
}