public class TeamLineupDto
{
    public List<PlayerViewDto> Starters { get; set; } = new();
    public List<PlayerViewDto> Bench { get; set; } = new();
    public PlayerViewDto? Captain { get; set; }
}

public class PlayerViewDto
{
    public Guid PlayerId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Position { get; set; } = null!;
}
