public class CreateTeamDto
{
    public required string Name { get; set; }
    public required Guid CoachId { get; set; }
    public required Guid[] PlayerIds { get; set; }
}