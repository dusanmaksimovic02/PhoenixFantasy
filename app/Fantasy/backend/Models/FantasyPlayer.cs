using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class FantasyPlayer
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Player player { get; set; }
}