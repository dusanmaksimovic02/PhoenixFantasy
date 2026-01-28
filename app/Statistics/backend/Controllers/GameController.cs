using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    private DataContext context { get; set; }

    public GameController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetGameById/{id}")]
    public async Task<IActionResult> GetGameById(string id)
    {
        try
        {
            var game = await context.Games.FirstOrDefaultAsync(x => x.Id.ToString() == id) ?? throw new Exception
            ($"Game with Id {id} doesn't exist");
            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetGames")]
    public async Task<IActionResult> GetGames()
    {
        try
        {
            var games = await context.Games.ToListAsync();
            return Ok(games);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddGame")]
    public async Task<ActionResult<Game>> AddGame([FromBody] Game game)
    {
        try
        {
            context.Games.Add(game);
            await context.SaveChangesAsync();
            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateGame")]
    public async Task<ActionResult<Game>> UpdateGame([FromBody] Game game)
    {
        try
        {
            var gameUpdate = await context.Games.FirstOrDefaultAsync(x => x.Id == game.Id) ?? throw new Exception
            ($"Game with Id {game.Id} doesn't exist");
            context.Games.Update(gameUpdate);
            await context.SaveChangesAsync();
            return Ok($"Game with Id {game.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteGame/{id}")]
    public async Task<ActionResult<Game>> DeleteGame(string id)
    {
        try
        {
            var game = await context.Games.FindAsync(id) ?? throw new Exception
            ($"Game with Id {id} doesn't exist");
            context.Games.Remove(game!);
            await context.SaveChangesAsync();
            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("AddRefereeToGame/{refereeId}/{gameId}")]
    public async Task<ActionResult<Game>> AddRefereeToGame(string refereeId, Guid gameId)
    {
        try
        {
            var game = await context.Games
                .Include(g => g.Referee)
                .FirstOrDefaultAsync(g => g.Id == gameId)
                ?? throw new Exception($"Game with Id {gameId} doesn't exist");

            var referee = await context.Referees
                .FirstOrDefaultAsync(r => r.Id == refereeId)
                ?? throw new Exception($"Referee with Id {refereeId} doesn't exist");

            var isBusy = await context.Games.AnyAsync(g =>
                g.Referee != null &&
                g.Referee.Id == refereeId &&
                g.dateTime == game.dateTime);

            if (isBusy)
                throw new Exception("Referee is already assigned to another game at the same time");

            game.Referee = referee;
            await context.SaveChangesAsync();

            return Ok($"Referee {refereeId} successfully added to game {gameId}");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}