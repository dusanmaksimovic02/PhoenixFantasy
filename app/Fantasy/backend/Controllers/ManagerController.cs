using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ManagerController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public ManagerController(FantasyDbContext context)
    {
        this.context = context;
    }

    [HttpPost("StartRound/{leagueId}")]
    public async Task<IActionResult> StartRound(Guid leagueId)
    {
        var league = await context.FantasyLeagues.FindAsync(leagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.IsRoundActive)
            return BadRequest("Runda je već aktivna");

        league.IsRoundActive = true;
        league.CurrentRound++;

        var teamPlayers = await context.FantasyTeamPlayers.ToListAsync();

        var rounds = teamPlayers.Select(tp => new FantasyPlayerRound
        {
            fantasyPlayer = tp,
            round = league.CurrentRound,
            Role = FantasyRole.Bench,
        });

        context.FantasyPlayerRounds.AddRange(rounds);

        await context.SaveChangesAsync();

        return Ok(new { league.CurrentRound });
    }

    [HttpPost("EndRound/{leagueId}")]
    public async Task<IActionResult> EndRound(Guid leagueId)
    {
        var league = await context.FantasyLeagues.FindAsync(leagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (!league.IsRoundActive)
            return BadRequest("Runda nije aktivna");

        league.IsRoundActive = false;

        await context.SaveChangesAsync();

        return Ok();
    }
}
