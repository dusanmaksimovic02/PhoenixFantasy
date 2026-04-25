using FantasyApi.Models;
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

    [HttpGet("GetPlayersByPosition")]
    public async Task<IActionResult> GetPlayersByPosition([FromQuery] string position)
    {
        var players = await _service.GetAllPlayers();
        var playersByPosition = new List<Player>();
        foreach (var p in players)
        {
            if (p.Position == position)
            {
                playersByPosition.Add(p);
            }
        }
        return Ok(playersByPosition);
    }

    [HttpGet("GetPlayersByTeam/{teamId}")]
    public async Task<IActionResult> GetPlayersByTeam(Guid teamId)
    {
        var players = await _service.GetPlayersByTeam(teamId);

        if (players == null)
            return NotFound("Team ne postoji");

        return Ok(players);
    }

    [HttpGet("GetAllCoaches")]
    public async Task<IActionResult> GetAllCoaches()
    {
        var coaches = await _service.GetAllCoaches();
        return Ok(coaches);
    }

    [HttpGet("GetCoachByTeam/{teamId}")]
    public async Task<IActionResult> GetCoachByTeam(Guid teamId)
    {
        var coaches = await _service.GetCoachByTeam(teamId);

        if (coaches == null)
            return NotFound("Team ne postoji");

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

    [HttpGet("GetCoachGameStats/{coachId}/{gameId}")]
    public async Task<IActionResult> GetCoachGameStats(Guid coachId, Guid gameId)
    {
        var stats = await _service.GetCoachGameStats(coachId, gameId);

        if (stats == null)
            return NotFound();

        return Ok(stats);
    }

    [HttpGet("GetStandings")]
    public async Task<IActionResult> GetStandings()
    {
        var standings = await _service.GetStandings();
        return Ok(standings);
    }

    [HttpGet("GetAllGamesForTeam/{teamId}")]
    public async Task<IActionResult> GetAllGamesForTeam(Guid teamId)
    {
        var games = await _service.GetAllGamesForTeam(teamId);
        return Ok(games);
    }

    [HttpGet("GetTeamPlayerAverages/{teamId}")]
    public async Task<IActionResult> GetTeamPlayerAverages(Guid teamId)
    {
        var result = await _service.GetTeamAveragePlayerStats(teamId);

        if (!result.Any())
            return NotFound();

        return Ok(result);
    }

    [HttpGet("GetPlayerAverages/{playerId}")]
    public async Task<IActionResult> GetPlayerAverages(Guid playerId)
    {
        var result = await _service.GetAveragePlayerStats(playerId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("GetGamesByRound")]
    public async Task<IActionResult> GetGamesByRound()
    {
        var result = await _service.GetGamesByRound();

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("GetGameById/{gameId}")]
    public async Task<IActionResult> GetGameById(Guid gameId)
    {
        var result = await _service.GetGameById(gameId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("GetPlayersStatsFromGame/{gameId}/{teamId}")]
    public async Task<IActionResult> GetPlayersStatsFromGame(Guid gameId, Guid teamId)
    {
        var result = await _service.GetPlayersStatsFromGame(gameId, teamId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
}
