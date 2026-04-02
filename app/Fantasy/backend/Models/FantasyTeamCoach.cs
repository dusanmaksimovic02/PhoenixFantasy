using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyTeamCoach
{
    public Guid FantasyTeamId { get; set; }
    public FantasyTeam FantasyTeam { get; set; }
    public Guid CoachId { get; set; }
}