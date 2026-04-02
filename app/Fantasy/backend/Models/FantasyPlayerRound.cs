using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyPlayerRound
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public FantasyTeamPlayer fantasyPlayer { get; set; }
    public double roundPoints { get; set; } = 0 ;
    public int round{ get; set; } = 1;
}