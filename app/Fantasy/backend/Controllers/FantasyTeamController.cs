using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FantasyApi.Data;
using FantasyApi.Models;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyTeamController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public FantasyTeamController(FantasyDbContext context)
    {
        this.context = context;
    }

    [HttpPost("AddFantasyTeam")]
    public async Task<IActionResult> AddFantasyTeam([FromBody] AddFantasyTeamDTO dto)
    {
        var team = new FantasyTeam
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            LeagueId = dto.LeagueId,
            UserId = dto.UserId
        };

        context.FantasyTeams.Add(team);
        await context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpGet("GetFantasyTeams")]
    public async Task<IActionResult> GetFantasyTeams()
    {
        var teams = await context.FantasyTeams
            .Include(t => t.User)
            .ToListAsync();

        return Ok(teams);
    }

    [HttpGet("GetFantasyTeamById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var team = await context.FantasyTeams
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
            return NotFound();

        return Ok(team);
    }

    [HttpPut("UpdateFantasyTeam/{id}")]
    public async Task<IActionResult> UpdateFantasyTeam(Guid id, [FromBody] AddFantasyTeamDTO dto)
    {
        var team = await context.FantasyTeams.FindAsync(id);

        if (team == null)
            return NotFound();

        team.Name = dto.Name;
        //team.LeagueId = dto.LeagueId;
        //team.UserId = dto.UserId;

        await context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpDelete("DeleteFantasyTeam/{id}")]
    public async Task<IActionResult> DeleteFantasyTeam(Guid id)
    {
        var team = await context.FantasyTeams.FindAsync(id);

        if (team == null)
            return NotFound();

        context.FantasyTeams.Remove(team);
        await context.SaveChangesAsync();

        return Ok("Deleted successfully");
    }
}