namespace StatsApi.Models;

public abstract class Person : IdentityUser
{
    [MaxLength(30)]
    public required string FirstName { get; set; }
    [MaxLength(50)]
    public required string LastName { get; set; }
    public string? TokenForgotPassword { get; internal set; }
    public DateTime ForgotPasswordExp { get; internal set; }
}