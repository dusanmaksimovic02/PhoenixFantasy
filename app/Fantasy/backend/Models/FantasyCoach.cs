using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyCoach
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Coach coach { get; set; }
}