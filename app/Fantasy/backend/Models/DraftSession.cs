using System.ComponentModel.DataAnnotations;
using FantasyApi.Models;

namespace FantasyApi.Models;

public class DraftSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LeagueId { get; set; }
    public FantasyLeague? League { get; set; }

    public List<DraftPickOrder> PickOrder { get; set; } = new();

    public int CurrentPickIndex { get; set; } = 0;

    public DateTime PickDeadline { get; set; }

    public bool IsActive { get; set; } = true;
    public DraftPhase Phase { get; set; }
}

public enum DraftPhase
{
    Player,
    Coach,
    Finished,
}
