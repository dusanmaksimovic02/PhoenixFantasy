public class TradePlayerDto
{
    public Guid FantasyTeamId { get; set; }
    public Guid OldPlayerId { get; set; }
    public Guid NewPlayerId { get; set; }
    public string NewPlayerPosition { get; set; } = null!;
}
