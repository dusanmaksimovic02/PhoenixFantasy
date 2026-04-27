using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Models;
using FantasyApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyRoundController : ControllerBase
{
    private FantasyDbContext context { get; set; }
    private FantasyPointsService service { get; set; }

    public FantasyRoundController(FantasyDbContext context, FantasyPointsService service)
    {
        this.context = context;
        this.service = service;
    }

    [HttpPut("CalculateTeamPoints/{fantasyTeamId}/{round}")]
    public async Task<IActionResult> CalculateTeamPoints(Guid fantasyTeamId, int round)
    {
        var playerRounds = await context
            .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
            .Where(x => x.fantasyPlayer!.FantasyTeamId == fantasyTeamId && x.round == round)
            .ToListAsync();

        var coachRound = await context
            .FantasyCoachRounds.Include(x => x.fantasyCoach)
            .FirstOrDefaultAsync(x => x.fantasyCoach!.FantasyTeamId == fantasyTeamId);

        var totalPoints = service.CalculateTeamPoints(playerRounds, coachRound);

        var teamRound = await context
            .FantasyTeamRounds.Include(t => t.fantasyTeam)
            .FirstOrDefaultAsync(t => t.fantasyTeam!.Id == fantasyTeamId && t.round == round);

        teamRound!.roundPoints = totalPoints;

        await context.SaveChangesAsync();

        return Ok(totalPoints);
    }

    [HttpPost("CalculatePlayerPoints")]
    public async Task<IActionResult> CalculatePlayerPoints([FromBody] Guid FantasyTeamId)
    {
        var playerRounds = await context
            .FantasyPlayerRounds.Include(x => x.PlayerGameStats)
            .Include(x => x.fantasyPlayer)
            .Where(x => x.fantasyPlayer.FantasyTeamId == FantasyTeamId)
            .ToListAsync();

        var coachRound = await context
            .FantasyCoachRounds.Include(x => x.CoachGameStats)
            .Include(x => x.fantasyCoach)
            .FirstOrDefaultAsync(x => x.fantasyCoach.FantasyTeamId == FantasyTeamId);

        var result = await service.CalculatePlayerPointsAsync(
            FantasyTeamId,
            playerRounds,
            coachRound
        );

        return Ok(result);
    }
}
