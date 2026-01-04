using System.ComponentModel.DataAnnotations;

namespace StatsApi.Models;

public class Player
{
    [Key]
    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? JerseyNumber { get; set; } // string jer moze 0 i 00 u istom timu
}