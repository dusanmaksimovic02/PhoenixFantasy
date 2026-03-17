public class AddCoachGameStatsDto
{
    public Guid GameId { get; set; }
    public Guid CoachId { get; set; }
    public int? CoachTechnicalFouls { get; set; }
    public int? BenchTechnicalFouls { get; set; }
}