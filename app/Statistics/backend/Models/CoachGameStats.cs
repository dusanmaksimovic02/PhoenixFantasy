using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class CoachGameStats
{
    [Key]
    public Guid Id { get; set; }
    public Game? Game { get; set; }
    public Coach? Coach { get; set; }
    public int? TechnicalFouls { get; set; }
    public int? Difference { get; set; }
}