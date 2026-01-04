using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class CoachController : ControllerBase
{
    private DataContext context { get; set; }

    public CoachController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetCoachById/{id}")]
    public async Task<IActionResult> GetCoachById(string id)
    {
        try
        {
            var coach = await context.Coaches.FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception
            ($"Coach with Id {id} doesn't exist");
            return Ok(coach);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetCoaches")]
    public async Task<IActionResult> GetCoaches()
    {
        try
        {
            var coaches = await context.Coaches.ToListAsync();
            return Ok(coaches);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddCoach")]
    public async Task<ActionResult<Coach>> AddCoach([FromBody] Coach coach)
    {
        try
        {
            context.Coaches.Add(coach);
            await context.SaveChangesAsync();
            return Ok(coach);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateCoach")]
    public async Task<ActionResult<Coach>> UpdateCoach([FromBody] Coach coach)
    {
        try
        {
            var coachUpdate = await context.Coaches.FirstOrDefaultAsync(x => x.Id == coach.Id) ?? throw new Exception
            ($"Coach with Id {coach.Id} doesn't exist");
            context.Coaches.Update(coachUpdate);
            await context.SaveChangesAsync();
            return Ok($"Coach with Id {coach.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteCoach/{id}")]
    public async Task<ActionResult<Coach>> DeleteCoach(string id)
    {
        try
        {
            var coach = await context.Coaches.FindAsync(id) ?? throw new Exception
            ($"Coach with Id {id} doesn't exist");
            context.Coaches.Remove(coach!);
            await context.SaveChangesAsync();
            return Ok(coach);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}