using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class CoachGameStats
{
    [Key]
    public Guid Id { get; set; }
    public Game? Game { get; set; }
    public Coach? Coach { get; set; }
    public int? CoachTechnicalFouls { get; set; } = 0;
    public int? BenchTechnicalFouls { get; set; } = 0;
    public int? Difference { get; set; }
}