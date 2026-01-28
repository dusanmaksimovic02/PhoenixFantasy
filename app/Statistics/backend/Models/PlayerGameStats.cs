using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class PlayerGameStats
{
    [Key]
    public Guid Id { get; set; }
    public Game? Game { get; set; }
    public Player? Player { get; set; }

    public int? Points { get; set; }
    public int? Made1p { get; set; }
    public int? Miss1p { get; set; }
    public int? Made2p { get; set; }
    public int? Miss2p { get; set; }
    public int? Made3p { get; set; }
    public int? Miss3p { get; set; }
    public int? Assists { get; set; }
    public int? Rebounds { get; set; }
    public int? OffensiveRebounds { get; set; }
    public int? DefensiveRebounds { get; set; }
    public int? Steals { get; set; }
    public int? Turnovers { get; set; }
    public int? Pir { get; set; }
    public int? PersonalFouls { get; set; }
    public int? RecievedFouls { get; set; }
    public int? Blocks { get; set; }
    public int? RecievedBlocks { get; set; }
    public int? TechnicalFouls { get; set; }
}