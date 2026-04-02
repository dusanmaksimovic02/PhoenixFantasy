using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeamPlayer
{
    public Guid FantasyTeamId { get; set; }
    public FantasyTeam FantasyTeam { get; set; }

    public Guid PlayerId { get; set; }

    public bool IsStarter { get; set; }
    public bool IsCaptain { get; set; }
    public bool IsInjured { get; set; }
}