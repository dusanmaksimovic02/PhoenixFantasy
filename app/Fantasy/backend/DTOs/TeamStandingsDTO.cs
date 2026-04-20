public class TeamStandingDto
{
    public string? TeamName { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public Guid TeamId { get; set; }
    public string? LogoPathUrl { get; set; }
}
