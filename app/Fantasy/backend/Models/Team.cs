using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class Team
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public Coach? coach { get; set; }
    public List<Player>? Players { get; set; }
    public string? logoPathURL { get; set; }
}
