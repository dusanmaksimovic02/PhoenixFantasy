public class StartGameDto
{
    public Guid GameId { get; set; }

    public List<Guid> HomeTeamPlayerIds { get; set; } = new();
    public List<Guid> HomeStartersIds { get; set; } = new();

    public List<Guid> GuestTeamPlayerIds { get; set; } = new();
    public List<Guid> GuestStartersIds { get; set; } = new();
}