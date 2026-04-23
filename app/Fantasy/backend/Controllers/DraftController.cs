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
    private readonly IHubContext<CreateDraftHub> createHubContext;
    private readonly StatsDbContext statsDbContext;

    public DraftController(
        FantasyDbContext context,
        IHubContext<DraftHub> hubContext,
        IHubContext<CreateDraftHub> createHubContext,
        StatsDbContext statsDbContext
    )
    {
        this.context = context;
        this.hubContext = hubContext;
        this.statsDbContext = statsDbContext;
        this.createHubContext = createHubContext;
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

        var currentPick = draft.PickOrder.OrderBy(p => p.Order).ToList()[draft.CurrentPickIndex];

        if (currentPick.FantasyTeamId != dto.FantasyTeamId)
            return BadRequest("Nije tvoj red");

        if (DateTime.UtcNow > draft.PickDeadline)
            return BadRequest("Isteklo vreme");

        var teamIdsInLeague = draft.League.fantasyTeams.Select(t => t.Id).ToList();

        var exists = await context.FantasyTeamPlayers.AnyAsync(x =>
            x.PlayerId == dto.PlayerId && teamIdsInLeague.Contains(x.FantasyTeamId)
        );

        if (exists)
            return BadRequest("Igrač već izabran");

        var playerFull = await statsDbContext.Players.FirstOrDefaultAsync(p =>
            p.Id == dto.PlayerId
        );

        if (playerFull == null)
            return BadRequest("Igrač nije pronađen");

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

        switch (playerFull.Position)
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

        await using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            context.FantasyTeamPlayers.Add(
                new FantasyTeamPlayer
                {
                    FantasyTeamId = dto.FantasyTeamId,
                    PlayerId = dto.PlayerId,
                    Position = playerFull.Position,
                }
            );

            draft.CurrentPickIndex++;
            draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

            if (draft.CurrentPickIndex >= draft.PickOrder.Count)
            {
                draft.Phase = DraftPhase.Coach;
                draft.CurrentPickIndex = 0;

                await context.SaveChangesAsync();
                await transaction.CommitAsync();

                await hubContext
                    .Clients.Group(draft.Id.ToString())
                    .SendAsync("PhaseChanged", "Coach");

                return Ok();
            }

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("PlayerPicked", new { playerFull });

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

            return Ok();
        }
        catch
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Greška u pickovanju");
        }
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

        if (draft.CurrentPickIndex >= draft.PickOrder.Count)
            return BadRequest("Draft završen");

        var sortedPickOrder = draft.PickOrder.OrderBy(p => p.Order).ToList();

        var currentPick = sortedPickOrder[draft.CurrentPickIndex];

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

        await using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            context.FantasyTeamCoaches.Add(
                new FantasyTeamCoach { FantasyTeamId = dto.FantasyTeamId, CoachId = dto.CoachId }
            );

            draft.CurrentPickIndex++;
            draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

            if (draft.CurrentPickIndex >= draft.PickOrder.Count)
            {
                draft.Phase = DraftPhase.Finished;
                draft.CurrentPickIndex = 0;

                await context.SaveChangesAsync();
                await transaction.CommitAsync();

                await hubContext
                    .Clients.Group(draft.Id.ToString())
                    .SendAsync("PhaseChanged", "Finished");

                return Ok();
            }

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            var coach = await context
                .DraftSessions.Include(d => d.PickOrder)
                .FirstOrDefaultAsync(d => d.Id == dto.DraftId);

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("CoachPicked", new { dto });

            await hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

            return Ok();
        }
        catch
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Greška prilikom izbora trenera");
        }
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

        var teams = league.fantasyTeams.OrderBy(x => Guid.NewGuid()).ToList();

        var pickOrderList = new List<DraftPickOrder>();

        int order = 0;
        int rounds = 10;

        for (int round = 0; round < rounds; round++)
        {
            var roundTeams = round % 2 == 0 ? teams : teams.AsEnumerable().Reverse();

            foreach (var team in roundTeams)
            {
                pickOrderList.Add(new DraftPickOrder { FantasyTeamId = team.Id, Order = order++ });
            }
        }

        var draft = new DraftSession
        {
            LeagueId = league.Id,
            CurrentPickIndex = 0,
            PickDeadline = DateTime.UtcNow.AddMinutes(1),
            IsActive = true,
            Phase = DraftPhase.Player,
            PickOrder = pickOrderList,
        };

        context.DraftSessions.Add(draft);

        await context.SaveChangesAsync();

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

        await createHubContext.Clients.Group(league.Id.ToString()).SendAsync("LeagueStarted");

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
