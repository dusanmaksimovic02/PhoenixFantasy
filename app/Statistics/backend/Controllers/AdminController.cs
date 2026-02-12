using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{
    private DataContext context { get; set; }

    public AdminController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetAdminById/{id}")]
    public async Task<IActionResult> GetAdminById(string id)
    {
        try
        {
            var admin = await context.Admins.FirstOrDefaultAsync(x => x.Id.ToString() == id) ?? throw new Exception
            ($"Admin with Id {id} doesn't exist");
            return Ok(admin);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetAdmins")]
    public async Task<IActionResult> GetAdmins()
    {
        try
        {
            var admins = await context.Admins.ToListAsync();
            return Ok(admins);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddAdmin")]
    public async Task<ActionResult<Admin>> AddAdmin([FromBody] Admin admin)
    {
        try
        {
            context.Admins.Add(admin);
            await context.SaveChangesAsync();
            return Ok(admin);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateAdmin")]
    public async Task<ActionResult<Admin>> UpdateAdmin([FromBody] Admin admin)
    {
        try
        {
            var adminUpdate = await context.Admins.FirstOrDefaultAsync(x => x.Id == admin.Id) ?? throw new Exception
            ($"Referee with Id {admin.Id} doesn't exist");

            adminUpdate.FirstName = admin.FirstName;
            adminUpdate.LastName = admin.LastName;
            adminUpdate.Email = admin.Email;    
            adminUpdate.UserName = admin.UserName;
            adminUpdate.PhoneNumber = admin.PhoneNumber;

            context.Admins.Update(adminUpdate);
            await context.SaveChangesAsync();
            return Ok($"Admin with Id {admin.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteADmin/{id}")]
    public async Task<ActionResult<Admin>> DeleteAdmin(string id)
    {
        try
        {
            var admin = await context.Admins.FindAsync(id) ?? throw new Exception
            ($"Admin with Id {id} doesn't exist");
            context.Admins.Remove(admin!);
            await context.SaveChangesAsync();
            return Ok(admin);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}