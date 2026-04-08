using System.ComponentModel.DataAnnotations;

namespace FantasyApi.Models;

public class Player
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? JerseyNumber { get; set; } // string jer moze 0 i 00 u istom timu
    public string? Position { get; set; }
}
