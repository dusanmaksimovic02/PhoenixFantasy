using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<Person> _userManager;

    public AdminController(DataContext context, UserManager<Person> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("GetAdminById/{id}")]
    public async Task<IActionResult> GetAdminById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound($"User with Id {id} not found");

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (!isAdmin)
            return BadRequest("User is not an Admin");

        return Ok(user);
    }

    [HttpGet("GetAdmins")]
    public async Task<IActionResult> GetAdmins()
    {
        var admins = await _userManager.GetUsersInRoleAsync("Admin");
        return Ok(admins);
    }

    [HttpPost("AddAdmin")]
    public async Task<IActionResult> AddAdmin([FromBody] RegisterDto dto)
    {
        var user = new Person
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "Admin");

        return Ok(user);
    }

    [HttpPut("UpdateAdmin")]
    public async Task<IActionResult> UpdateAdmin([FromBody] Person updatedUser)
    {
        var user = await _userManager.FindByIdAsync(updatedUser.Id);
        if (user == null)
            return NotFound($"User with Id {updatedUser.Id} not found");

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (!isAdmin)
            return BadRequest("User is not an Admin");

        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Email = updatedUser.Email;
        user.UserName = updatedUser.UserName;
        user.PhoneNumber = updatedUser.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok($"Admin with Id {user.Id} updated successfully");
    }

    [HttpDelete("DeleteAdmin/{id}")]
    public async Task<IActionResult> DeleteAdmin(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound($"User with Id {id} not found");

        var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (!isAdmin)
            return BadRequest("User is not an Admin");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok($"Admin with Id {id} deleted successfully");
    }
}
