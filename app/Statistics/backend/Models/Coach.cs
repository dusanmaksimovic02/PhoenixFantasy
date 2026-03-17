using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Coach
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
}