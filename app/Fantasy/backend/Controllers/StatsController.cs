using FantasyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace FantasyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly StatsService _service;

    public StatsController(StatsService service)
    {
        _service = service;
    }

    [HttpGet("GetAllTeams")]
    public async Task<IActionResult> GetAllTeams()
    {
        var teams = await _service.GetAllTeams();
        return Ok(teams);
    }

    [HttpGet("GetAllPlayers")]
    public async Task<IActionResult> GetAllPlayers()
    {
        var players = await _service.GetAllPlayers();
        return Ok(players);
    }

    [HttpGet("GetAllCoaches")]
    public async Task<IActionResult> GetAllCoaches()
    {
        var coaches = await _service.GetAllCoaches();
        return Ok(coaches);
    }

    [HttpGet("GetAllGames")]
    public async Task<IActionResult> GetAllGames()
    {
        var games = await _service.GetAllGames();
        return Ok(games);
    }

    [HttpGet("GetPlayerGameStats")]
    public async Task<IActionResult> GetPlayerGameStats(Guid playerId, Guid gameId)
    {
        var stats = await _service.GetPlayerGameStats(playerId, gameId);

        if (stats == null)
            return NotFound();

        return Ok(stats);
    }

    [HttpGet("GetCoachGameStats")]
    public async Task<IActionResult> GetCoachGameStats(Guid coachId, Guid gameId)
    {
        var stats = await _service.GetCoachGameStats(coachId, gameId);

        if (stats == null)
            return NotFound();

        return Ok(stats);
    }
}
