using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PlayerController : ControllerBase
{
    private DataContext context { get; set; }

    public PlayerController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetPlayerById/{id}")]
    public async Task<IActionResult> GetPlayerById(string id)
    {
        try
        {
            var player = await context.Players.FirstOrDefaultAsync(x => x.Id == id) ?? throw new Exception
            ($"Player with Id {id} doesn't exist");
            return Ok(player);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetPlayers")]
    public async Task<IActionResult> GetPlayers()
    {
        try
        {
            var players = await context.Players.ToListAsync();
            return Ok(players);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddPlayer")]
    public async Task<ActionResult<Player>> AddPlayer([FromBody] Player player)
    {
        try
        {
            context.Players.Add(player);
            await context.SaveChangesAsync();
            return Ok(player);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdatePlayer")]
    public async Task<ActionResult<Player>> UpdatePlayer([FromBody] Player player)
    {
        try
        {
            var playerUpdate = await context.Players.FirstOrDefaultAsync(x => x.Id == player.Id) ?? throw new Exception
            ($"Player with Id {player.Id} doesn't exist");
            context.Players.Update(playerUpdate);
            await context.SaveChangesAsync();
            return Ok($"Player with Id {player.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeletePlayer/{id}")]
    public async Task<ActionResult<Player>> DeletePlayer(string id)
    {
        try
        {
            var player = await context.Players.FindAsync(id) ?? throw new Exception
            ($"Player with Id {id} doesn't exist");
            context.Players.Remove(player!);
            await context.SaveChangesAsync();
            return Ok(player);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}