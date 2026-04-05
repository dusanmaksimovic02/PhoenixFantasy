

using Microsoft.AspNetCore.Mvc;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PlayerGameStatsController : ControllerBase
{
    private readonly PlayerStatService _playerStatService;

    public PlayerGameStatsController(PlayerStatService playerStatService)
    {
        _playerStatService = playerStatService;
    }

    [HttpPost("UpdateStats")]
    public async Task<IActionResult> UpdateStats([FromBody] UpdatePlayerStatDto dto)
    {
        try
        {
            await _playerStatService.UpdateStatAsync(dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetTeamPlayersFromGame/{teamId}/{gameId}")]
    public async Task<ActionResult<IEnumerable<PlayerGameStats>>> GetTeamPlayersFromGame(Guid teamId, Guid gameId)
    {
        try
        {
            var players = await _playerStatService.GetTeamPlayersFromGame(teamId, gameId);
            return Ok(players);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetPlayerStatsFromGame/{playerId}/{gameId}")]
    public async Task<ActionResult<PlayerGameStats>> GetPlayerStatsFromGame(Guid playerId, Guid gameId)
    {
        try
        {
            var player = await _playerStatService.GetPlayerStatsFromGame(playerId, gameId);
            return Ok(player);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetTeamStartersFromGame/{teamId}/{gameId}")]
    public async Task<ActionResult<IEnumerable<Player>>> GetTeamStartersFromGame(Guid teamId, Guid gameId)
    {
        try
        {
            var players = await _playerStatService.GetTeamStartersFromGame(teamId, gameId);
            return Ok(players);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetTeamNonStartersFromGame/{teamId}/{gameId}")]
    public async Task<ActionResult<IEnumerable<Player>>> GetTeamNonStartersFromGame(Guid teamId, Guid gameId)
    {
        try
        {
            var players = await _playerStatService.GetTeamNonStartersFromGame(teamId, gameId);
            return Ok(players);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("ChangeStarter/{gameId}/{prevStarter}/{newStarter}")]
    public async Task<ActionResult> ChangeStarter(Guid gameId, Guid prevStarter, Guid newStarter)
    {
        try
        {
            await _playerStatService.ChangeStarter(gameId, prevStarter, newStarter);
            return Ok("Starter changed successfully!");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

