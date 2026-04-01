using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class PlayerImage
{
    [Key]
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public string ImageUrl { get; set; }
}