using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Team
{
    [Key]
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public Coach? coach { get; set; }
    public List<Player>? Players { get; set; }

}