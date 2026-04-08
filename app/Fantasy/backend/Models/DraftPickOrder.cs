using System.ComponentModel.DataAnnotations;
using FantasyApi.Models;

namespace FantasyApi.Models;

public class DraftPickOrder
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Order { get; set; }

    public Guid FantasyTeamId { get; set; }
    public FantasyTeam? FantasyTeam { get; set; }
}
