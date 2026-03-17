public class UpdatePlayerStatDto
{
    public string? GameId { get; set; }
    public string PlayerId { get; set; } = null!;
    public List<StatChange> Changes { get; set; } = new();
}