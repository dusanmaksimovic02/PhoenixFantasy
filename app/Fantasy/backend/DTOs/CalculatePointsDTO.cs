using FantasyApi.Enums;

public class CalculatePointsDto
{
    public Guid Id { get; set; }
    public FantasyRole Role { get; set; }
    public double Points { get; set; }
}
