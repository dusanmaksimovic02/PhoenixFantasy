using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Coach
{
    [Key]
    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
}