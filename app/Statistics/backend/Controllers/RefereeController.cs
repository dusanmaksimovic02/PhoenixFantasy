using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class RefereeController : ControllerBase
{
    private DataContext context { get; set; }

    public RefereeController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetRefereeById/{id}")]
    public async Task<IActionResult> GetRefereeById(string id)
    {
        try
        {
            var referee = await context.Referees.FirstOrDefaultAsync(x => x.Id.ToString() == id) ?? throw new Exception
            ($"Referee with Id {id} doesn't exist");
            return Ok(referee);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetReferees")]
    public async Task<IActionResult> GetReferees()
    {
        try
        {
            var referees = await context.Referees.ToListAsync();
            return Ok(referees);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddReferee")]
    public async Task<ActionResult<Referee>> AddReferee([FromBody] Referee referee)
    {
        try
        {
            context.Referees.Add(referee);
            await context.SaveChangesAsync();
            return Ok(referee);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateReferee")]
    public async Task<ActionResult<Referee>> UpdateReferee([FromBody] Referee referee)
    {
        try
        {
            var refereeUpdate = await context.Referees.FirstOrDefaultAsync(x => x.Id == referee.Id) ?? throw new Exception
            ($"Referee with Id {referee.Id} doesn't exist");
            context.Referees.Update(refereeUpdate);
            await context.SaveChangesAsync();
            return Ok($"Referee with Id {referee.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteReferee/{id}")]
    public async Task<ActionResult<Referee>> DeleteReferee(string id)
    {
        try
        {
            var referee = await context.Referees.FindAsync(id) ?? throw new Exception
            ($"Referee with Id {id} doesn't exist");
            context.Referees.Remove(referee!);
            await context.SaveChangesAsync();
            return Ok(referee);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("GetAllFreeReferees/{date}")]
    public async Task<ActionResult<IEnumerable<Referee>>> GetAllFreeReferees(DateTime date)
    {
        try
        {
            var busyRefereeIds = await context.Games
                .Where(g => g.dateTime.Date == date.Date && g.Referee != null)
                .Select(g => g.Referee!.Id)
                .ToListAsync();

            var freeReferees = await context.Referees
                .Where(r => !busyRefereeIds.Contains(r.Id))
                .ToListAsync();

            return Ok(freeReferees);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetAllGamesForReferee/{refereeId}")]
    public async Task<ActionResult<IEnumerable<Game>>> GetAllGamesForReferee(string refereeId)
    {
        try
        {
            var refereeExists = await context.Referees
                .AnyAsync(r => r.Id == refereeId);

            if (!refereeExists)
                throw new Exception($"Referee with Id {refereeId} doesn't exist");

            var games = await context.Games
                .Include(g => g.HomeTeam)
                .Include(g => g.GuestTeam)
                .Where(g => g.Referee != null && g.Referee.Id == refereeId)
                .ToListAsync();

            return Ok(games);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


}