public class AddGameDto
{
    public Guid HomeTeamId { get; set; }
    public Guid GuestTeamId { get; set; }
    public DateTime dateTime { get; set; }
    public string? Venue { get; set; }
    public string? RefereeId { get; set; }
    public int? Round { get; set; }
}
