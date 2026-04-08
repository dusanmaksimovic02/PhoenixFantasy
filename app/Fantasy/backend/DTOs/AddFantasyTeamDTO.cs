public class AddFantasyTeamDTO
{
    public Guid? LeagueId { get; set; }
    public required string Name { get; set; }

    //public Person User { get; set; }
    public string? UserId { get; set; }
}
