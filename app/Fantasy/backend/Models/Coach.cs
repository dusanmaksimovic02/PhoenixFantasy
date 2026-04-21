using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class Coach
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
     public Guid? TeamId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
}
