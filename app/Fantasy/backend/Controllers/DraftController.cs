using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Hubs;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DraftController : ControllerBase
{
    private FantasyDbContext context { get; set; }
    private readonly IHubContext<DraftHub> hubContext;
    private readonly StatsDbContext statsDbContext;

    public DraftController(
        FantasyDbContext context,
        IHubContext<DraftHub> hubContext,
        StatsDbContext statsDbContext
    )
    {
        this.context = context;
        this.hubContext = hubContext;
        this.statsDbContext = statsDbContext;
    }

    [HttpPost("PickPlayer")]
    public async Task<IActionResult> PickPlayer(PickPlayerDto dto)
    {
        var draft = await context
            .DraftSessions.Include(d => d.PickOrder)
            .FirstOrDefaultAsync(d => d.Id == dto.DraftId);

        if (draft == null)
            return BadRequest("Draft ne postoji");

        if (draft.CurrentPickIndex >= draft.PickOrder.Count)
            return BadRequest("Draft završen");

        var currentPick = draft.PickOrder[draft.CurrentPickIndex];

        if (currentPick.FantasyTeamId != dto.FantasyTeamId)
            return BadRequest("Nije tvoj red");

        if (DateTime.UtcNow > draft.PickDeadline)
            return BadRequest("Isteklo vreme");

        var exists = await context.FantasyTeamPlayers.AnyAsync(x => x.PlayerId == dto.PlayerId);

        if (exists)
            return BadRequest("Igrač već izabran");

        var player = await statsDbContext
            .Players.Where(p => p.Id == dto.PlayerId)
            .Select(p => new { p.Id, p.Position })
            .FirstOrDefaultAsync();

        if (player == null)
            return BadRequest("Igrač ne postoji");

        var teamPlayerIds = await context
            .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == dto.FantasyTeamId)
            .Select(tp => tp.PlayerId)
            .ToListAsync();

        var positionCounts = await statsDbContext
            .Players.Where(p => teamPlayerIds.Contains(p.Id))
            .GroupBy(p => p.Position)
            .Select(g => new { Position = g.Key, Count = g.Count() })
            .ToListAsync();

        int guards = positionCounts.FirstOrDefault(x => x.Position == "Guard")?.Count ?? 0;
        int forwards = positionCounts.FirstOrDefault(x => x.Position == "Forward")?.Count ?? 0;
        int centers = positionCounts.FirstOrDefault(x => x.Position == "Center")?.Count ?? 0;

        switch (player.Position)
        {
            case "Guard":
                if (guards >= 4)
                    return BadRequest("Već imaš 4 guarda");
                break;

            case "Forward":
                if (forwards >= 4)
                    return BadRequest("Već imaš 4 forwarda");
                break;

            case "Center":
                if (centers >= 2)
                    return BadRequest("Već imaš 2 centra");
                break;
        }

        context.FantasyTeamPlayers.Add(
            new FantasyTeamPlayer { FantasyTeamId = dto.FantasyTeamId, PlayerId = dto.PlayerId }
        );

        draft.CurrentPickIndex++;
        draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

        await context.SaveChangesAsync();

        await hubContext.Clients.Group(draft.Id.ToString()).SendAsync("PlayerPicked", dto);

        await hubContext
            .Clients.Group(draft.Id.ToString())
            .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

        return Ok();
    }
}
