using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PersonController : ControllerBase
{
    private readonly UserManager<Person> userManager;

    public PersonController(UserManager<Person> userManager)
    {
        this.userManager = userManager;
    }

    [HttpPut("EditProfile")]
    public async Task<IActionResult> EditProfile(EditProfileDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new Exception("User not authenticated");
    
            var user = await userManager.FindByIdAsync(userId)
                ?? throw new Exception("User not found");
    
            var person = user as Person
                ?? throw new Exception("Invalid user type");
    
            if (!string.IsNullOrWhiteSpace(dto.FirstName))
                person.FirstName = dto.FirstName;
    
            if (!string.IsNullOrWhiteSpace(dto.LastName))
                person.LastName = dto.LastName;
    
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                person.PhoneNumber = dto.PhoneNumber;
    
            var result = await userManager.UpdateAsync(person);
    
            if (!result.Succeeded)
                throw new Exception(string.Join(", ",
                    result.Errors.Select(e => e.Description)));
    
            return Ok("Profile successfully updated");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}

public class EditProfileDto
{
    [MaxLength(30)]
    public string? FirstName { get; set; }

    [MaxLength(50)]
    public string? LastName { get; set; }

    public string? PhoneNumber { get; set; }
}