using System.ComponentModel.DataAnnotations;
using FantasyApi.Enums;

namespace FantasyApi.Models;

public class FantasyTeamCoach
{
    public Guid FantasyTeamId { get; set; }
    public required FantasyTeam FantasyTeam { get; set; }
    public Guid CoachId { get; set; }
}
