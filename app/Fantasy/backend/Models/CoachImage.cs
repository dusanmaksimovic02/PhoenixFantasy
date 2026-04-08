using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class CoachImage
{
    [Key]
    public Guid Id { get; set; }
    public Guid CoachId { get; set; }
    public string? ImageUrl { get; set; }
}
