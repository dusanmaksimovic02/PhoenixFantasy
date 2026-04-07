using FantasyApi.Models;

namespace FantasyApi.Models;
public class DraftPickOrder
{
    public int Order { get; set; }

    public Guid FantasyTeamId { get; set; }
    public FantasyTeam FantasyTeam { get; set; }
}