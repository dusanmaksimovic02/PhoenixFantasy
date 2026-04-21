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
    public async Task<IActionResult> PickPlayer([FromBody] PickPlayerDto dto)
    {
        var draft = await context
            .DraftSessions.Include(d => d.PickOrder)
            .Include(d => d.League)
                .ThenInclude(l => l.fantasyTeams)
            .FirstOrDefaultAsync(d => d.Id == dto.DraftId);

        if (draft == null)
            return BadRequest("Draft ne postoji");

        if (draft.Phase != DraftPhase.Player)
            return BadRequest("Nije faza za biranje igrača");

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

        var playerFull = await statsDbContext
            .Players.Where(p => p.Id == dto.PlayerId)
            .FirstOrDefaultAsync();

        if (playerFull == null) return BadRequest("Igrač nije pronađen");

        var player = new { playerFull.Position, playerFull.Id };

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

        //draft.CurrentPickIndex++;
        draft.CurrentPickIndex = (draft.CurrentPickIndex + 1) % draft.League!.fantasyTeams!.Count;

        if (draft.CurrentPickIndex < draft.PickOrder.Count)
        {
            draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

            await context.SaveChangesAsync();

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("PlayerPicked", new { playerFull });

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

            return Ok();
        }

        draft.Phase = DraftPhase.Coach;
        draft.CurrentPickIndex = 0;
        draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

        await context.SaveChangesAsync();

        await hubContext.Clients.Group(draft.Id.ToString()).SendAsync("PhaseChanged", "Coach");

        return Ok();
    }

    [HttpPost("PickCoach")]
    public async Task<IActionResult> PickCoach(PickCoachDto dto)
    {
        var draft = await context
            .DraftSessions.Include(d => d.PickOrder)
            .FirstOrDefaultAsync(d => d.Id == dto.DraftId);

        if (draft == null)
            return BadRequest("Draft ne postoji");

        if (draft.Phase != DraftPhase.Coach)
            return BadRequest("Nije faza za trenere");

        var currentPick = draft.PickOrder[draft.CurrentPickIndex];

        if (currentPick.FantasyTeamId != dto.FantasyTeamId)
            return BadRequest("Nije tvoj red");

        if (DateTime.UtcNow > draft.PickDeadline)
            return BadRequest("Isteklo vreme");

        var alreadyHasCoach = await context.FantasyTeamCoaches.AnyAsync(x =>
            x.FantasyTeamId == dto.FantasyTeamId
        );

        if (alreadyHasCoach)
            return BadRequest("Već imaš trenera");

        var exists = await context.FantasyTeamCoaches.AnyAsync(x => x.CoachId == dto.CoachId);

        if (exists)
            return BadRequest("Trener već izabran");

        var coachExists = await statsDbContext.Coaches.AnyAsync(c => c.Id == dto.CoachId);

        if (!coachExists)
            return BadRequest("Trener ne postoji");

        context.FantasyTeamCoaches.Add(
            new FantasyTeamCoach { FantasyTeamId = dto.FantasyTeamId, CoachId = dto.CoachId }
        );

        draft.CurrentPickIndex = (draft.CurrentPickIndex + 1) % draft.League!.fantasyTeams!.Count;
        //draft.PickDeadline = DateTime.Now.AddMinutes(1);

        await context.SaveChangesAsync();

        await hubContext.Clients.Group(draft.Id.ToString()).SendAsync("CoachPicked", dto);

        await hubContext
            .Clients.Group(draft.Id.ToString())
            .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

        return Ok();
    }

    [HttpPost("StartDraft")]
    public async Task<IActionResult> StartDraft(StartDraftDto dto)
    {
        var league = await context
            .FantasyLeagues.Include(l => l.fantasyTeams)
            .FirstOrDefaultAsync(l => l.Id == dto.LeagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.fantasyTeams == null || !league.fantasyTeams.Any())
            return BadRequest("Nema timova u ligi");

        // RANDOM redosled
        var teams = league.fantasyTeams.OrderBy(x => Guid.NewGuid()).ToList();

        // Kreiranje PickOrder
        var pickOrderList = new List<DraftPickOrder>();

        for (int i = 0; i < teams.Count; i++)
        {
            pickOrderList.Add(new DraftPickOrder { FantasyTeamId = teams[i].Id, Order = i });
        }

        context.AddRange(pickOrderList);
        await context.SaveChangesAsync();

        var draft = new DraftSession
        {
            LeagueId = league.Id,
            CurrentPickIndex = 0,
            PickDeadline = DateTime.UtcNow.AddMinutes(1),
            IsActive = true,
        };

        context.DraftSessions.Add(draft);
        draft.PickOrder.AddRange(pickOrderList);
        await context.SaveChangesAsync();

        // SignalR - start drafta
        await hubContext
            .Clients.Group(draft.Id.ToString())
            .SendAsync(
                "DraftStarted",
                new
                {
                    draft.Id,
                    draft.CurrentPickIndex,
                    draft.PickDeadline,
                    PickOrder = pickOrderList.Select(p => new { p.Order, p.FantasyTeamId }),
                }
            );

        return Ok(draft.Id);
    }

    [HttpGet("GetDraftSessionId/{leagueId}")]
    public async Task<ActionResult<Guid>> GetDraftSession(Guid leagueId)
    {
        try
        {
            var session = context.DraftSessions.Where(s => s.LeagueId == leagueId).FirstOrDefault();
            return Ok(session != null ? session.Id : "");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetDraftStatus/{draftId}")]
    public async Task<IActionResult> GetDraftStatus(Guid draftId)
    {
        var draft = await context
            .DraftSessions.Include(d => d.PickOrder)
            .FirstOrDefaultAsync(d => d.Id == draftId);

        if (draft == null)
            return NotFound("Sesija nije pronadjena");

        return Ok(
            new
            {
                draft.Id,
                draft.CurrentPickIndex,
                draft.PickDeadline,
                PickOrder = draft
                    .PickOrder.OrderBy(p => p.Order)
                    .Select(p => new { p.Order, p.FantasyTeamId }),
                draft.Phase,
            }
        );
    }
}
