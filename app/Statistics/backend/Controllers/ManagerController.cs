using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ManagerController : ControllerBase
{
    private DataContext context { get; set; }

    public ManagerController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetManagerById/{id}")]
    public async Task<IActionResult> GetManagerById(string id)
    {
        try
        {
            var manager = await context.Managers
                .FirstOrDefaultAsync(x => x.Id.ToString() == id)
                ?? throw new Exception($"Manager with Id {id} doesn't exist");

            return Ok(manager);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetManagers")]
    public async Task<IActionResult> GetManagers()
    {
        try
        {
            var managers = await context.Managers.ToListAsync();
            return Ok(managers);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("AddManager")]
    public async Task<ActionResult<Manager>> AddManager([FromBody] Manager manager)
    {
        try
        {
            context.Managers.Add(manager);
            await context.SaveChangesAsync();
            return Ok(manager);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateManager")]
    public async Task<ActionResult> UpdateManager([FromBody] Manager manager)
    {
        try
        {
            var managerUpdate = await context.Managers
                .FirstOrDefaultAsync(x => x.Id == manager.Id)
                ?? throw new Exception($"Manager with Id {manager.Id} doesn't exist");

            managerUpdate.FirstName = manager.FirstName;
            managerUpdate.LastName = manager.LastName;
            managerUpdate.Email = manager.Email;
            managerUpdate.UserName = manager.UserName;
            managerUpdate.PhoneNumber = manager.PhoneNumber;

            context.Managers.Update(managerUpdate);
            await context.SaveChangesAsync();

            return Ok($"Manager with Id {manager.Id} updated successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteManager/{id}")]
    public async Task<ActionResult<Manager>> DeleteManager(string id)
    {
        try
        {
            var manager = await context.Managers.FindAsync(id)
                ?? throw new Exception($"Manager with Id {id} doesn't exist");

            context.Managers.Remove(manager);
            await context.SaveChangesAsync();

            return Ok(manager);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
