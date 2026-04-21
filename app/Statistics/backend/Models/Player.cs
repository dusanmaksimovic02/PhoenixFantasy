using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Player
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? TeamId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? JerseyNumber { get; set; } 
    public string? Position { get; set; }
}