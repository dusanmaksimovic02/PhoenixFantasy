using System.ComponentModel.DataAnnotations;
using FantasyApi.Enums;

namespace FantasyApi.Models;

public class FantasyTeamPlayer
{
    public Guid FantasyTeamId { get; set; }
    public FantasyTeam FantasyTeam { get; set; }

    public Guid PlayerId { get; set; }

    public FantasyRole Role { get; set; }

    public PlayerGameStats? PlayerGameStats { get; set; }
}