using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TeamController : ControllerBase
{
    private DataContext context { get; set; }

    public TeamController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetTeamById/{id}")]
    public async Task<IActionResult> GetTeamById(string id)
    {
        try
        {
            var team = await context.Teams.FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception
            ($"Team with Id {id} doesn't exist");
            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetTeams")]
    public async Task<IActionResult> GetTeams()
    {
        try
        {
            var teams = await context.Teams.ToListAsync();
            return Ok(teams);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddTeam")]
    public async Task<ActionResult<Team>> AddTeam([FromBody] Team team)
    {
        try
        {
            context.Teams.Add(team);
            await context.SaveChangesAsync();
            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateTeam")]
    public async Task<ActionResult<Team>> UpdateTeam([FromBody] Team team)
    {
        try
        {
            var teamUpdate = await context.Teams.FirstOrDefaultAsync(x => x.Id == team.Id) ?? throw new Exception
            ($"Team with Id {team.Id} doesn't exist");
            context.Teams.Update(teamUpdate);
            await context.SaveChangesAsync();
            return Ok($"Team with Id {team.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteTeam/{id}")]
    public async Task<ActionResult<Team>> DeleteTeam(string id)
    {
        try
        {
            var team = await context.Teams.FindAsync(id) ?? throw new Exception
            ($"Team with Id {id} doesn't exist");
            context.Teams.Remove(team!);
            await context.SaveChangesAsync();
            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPut("AddPlayerToTeam/{playerId}/{teamId}")]
    public async Task<ActionResult<Team>> AddPlayerToTeam(string playerId, string teamId)
    {
        try
    {
        var team = await context.Teams
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId)
            ?? throw new Exception($"Team with Id {teamId} doesn't exist");

        var player = await context.Players
            .FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new Exception($"Player with Id {playerId} doesn't exist");

        if (team.Players == null)
            team.Players = new List<Player>();

        if (team.Players.Any(p => p.Id == player.Id))
            throw new Exception("Player is already in the team");

        team.Players.Add(player);
        await context.SaveChangesAsync();

        return Ok($"Player with Id {playerId} added to team {teamId} successfully");
    }
    catch (Exception e)
    {
        return BadRequest(e.Message);
    }
    }
}