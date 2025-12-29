namespace StatsApi.Models;

public class League
{
    [Key]
    public string? Id { get; set; }
    public string? Name { get; set; }
    public List<Team>? Teams { get; set; }
}