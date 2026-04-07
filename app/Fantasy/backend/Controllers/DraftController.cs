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

    public DraftController(FantasyDbContext context, IHubContext<DraftHub> hubContext)
    {
        this.context = context;
        this.hubContext = hubContext;
    }

    [HttpPost("PickPlayer")]
    public async Task<IActionResult> PickPlayer(PickPlayerDto dto)
    {
        var draft = await context
            .DraftSessions.Include(d => d.PickOrder)
            .FirstOrDefaultAsync(d => d.Id == dto.DraftId);

        var currentPick = draft!.PickOrder[draft.CurrentPickIndex];

        if (currentPick.FantasyTeamId != dto.FantasyTeamId)
            return BadRequest("Nije tvoj red");

        if (DateTime.UtcNow > draft.PickDeadline)
            return BadRequest("Isteklo vreme");

        var exists = await context.FantasyTeamPlayers.AnyAsync(x => x.PlayerId == dto.PlayerId);

        if (exists)
            return BadRequest("Igrač već izabran");

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
