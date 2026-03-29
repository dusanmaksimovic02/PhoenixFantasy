public class UpdateGameDTO
{
    public Guid GameId { get; set; }
    public Guid HomeTeamId { get; set; }
    public Guid GuestTeamId { get; set; }
    public DateTime DateTime { get; set; }
    public string? Venue { get; set; }
    public string? RefereeId { get; set; }
    public int? Round { get;set; }
}