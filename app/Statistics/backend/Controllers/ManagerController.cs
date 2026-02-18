using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ManagerController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<Person> _userManager;

    public ManagerController(DataContext context, UserManager<Person> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("GetManagerById/{id}")]
    public async Task<IActionResult> GetManagerById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound($"User with Id {id} not found");

        var isManager = await _userManager.IsInRoleAsync(user, "Manager");
        if (!isManager)
            return BadRequest("User is not a Manager");

        return Ok(user);
    }

    [HttpGet("GetManagers")]
    public async Task<IActionResult> GetManagers()
    {
        var managers = await _userManager.GetUsersInRoleAsync("Manager");
        return Ok(managers);
    }

    [HttpPost("AddManager")]
    public async Task<IActionResult> AddManager([FromBody] RegisterDto dto)
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

        await _userManager.AddToRoleAsync(user, "Manager");

        return Ok(user);
    }

    [HttpPut("UpdateManager")]
    public async Task<IActionResult> UpdateManager([FromBody] Person updatedUser)
    {
        var user = await _userManager.FindByIdAsync(updatedUser.Id);
        if (user == null)
            return NotFound($"User with Id {updatedUser.Id} not found");

        var isManager = await _userManager.IsInRoleAsync(user, "Manager");
        if (!isManager)
            return BadRequest("User is not a Manager");

        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Email = updatedUser.Email;
        user.UserName = updatedUser.UserName;
        user.PhoneNumber = updatedUser.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok($"Manager with Id {user.Id} updated successfully");
    }

    [HttpDelete("DeleteManager/{id}")]
    public async Task<IActionResult> DeleteManager(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound($"User with Id {id} not found");

        var isManager = await _userManager.IsInRoleAsync(user, "Manager");
        if (!isManager)
            return BadRequest("User is not a Manager");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok($"Manager with Id {id} deleted successfully");
    }
}
