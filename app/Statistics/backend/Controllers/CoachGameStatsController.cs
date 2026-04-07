using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class CoachGameStatsController : ControllerBase
{
    private DataContext context { get; set; }

    public CoachGameStatsController(DataContext context)
    {
        this.context = context;
    }

    [HttpPut("AddTechnicalFoul")]
    public async Task<IActionResult> AddTechnicalFoul(Guid gameId, Guid coachId, string type)
    {
        try
        {
            var stats =
                await context.CoachGameStats.FirstOrDefaultAsync(x =>
                    x.Game!.Id == gameId && x.Coach!.Id == coachId
                )
                ?? throw new Exception(
                    $"Stats for CoachId {coachId} and GameId {gameId} don't exist"
                );

            if (type == "coach")
                stats.CoachTechnicalFouls++;
            else if (type == "bench")
                stats.BenchTechnicalFouls++;
            else
                throw new Exception("Invalid type");

            context.CoachGameStats.Update(stats);
            await context.SaveChangesAsync();

            return Ok($"Technical foul ({type}) added successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("RemoveTechnicalFoul")]
    public async Task<IActionResult> RemoveTechnicalFoul(Guid gameId, Guid coachId, string type)
    {
        try
        {
            var stats =
                await context.CoachGameStats.FirstOrDefaultAsync(x =>
                    x.Game!.Id == gameId && x.Coach!.Id == coachId
                )
                ?? throw new Exception(
                    $"Stats for CoachId {coachId} and GameId {gameId} don't exist"
                );

            if (type == "coach")
                stats.CoachTechnicalFouls--;
            else if (type == "bench")
                stats.BenchTechnicalFouls--;
            else
                throw new Exception("Invalid type");

            context.CoachGameStats.Update(stats);
            await context.SaveChangesAsync();

            return Ok($"Technical foul ({type}) removed successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetCoachStats/{gameId}/{coachId}")]
    public async Task<ActionResult<CoachGameStats>> GetCoachStats(Guid gameId, Guid coachId)
    {
        try
        {
            var stats =
                await context
                    .CoachGameStats.Include(x => x.Coach)
                    .Include(x => x.Game)
                    .FirstOrDefaultAsync(x => x.Game!.Id == gameId && x.Coach!.Id == coachId)
                ?? throw new Exception(
                    $"Stats for CoachId {coachId} and GameId {gameId} don't exist"
                );

            return stats;
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
