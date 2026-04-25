using FantasyApi.Data;
using FantasyApi.Hubs;
using FantasyApi.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class DraftTimerService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<DraftHub> _hubContext;
    private static readonly Random _random = new();

    public DraftTimerService(IServiceScopeFactory scopeFactory, IHubContext<DraftHub> hubContext)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<FantasyDbContext>();

                var drafts = await context
                    .DraftSessions.Where(d => d.IsActive && d.Phase == DraftPhase.Player)
                    .Select(d => new
                    {
                        d.Id,
                        d.CurrentPickIndex,
                        d.PickDeadline,
                    })
                    .ToListAsync(stoppingToken);

                Console.WriteLine($"[TIMER] Found drafts: {drafts.Count}");

                foreach (var draft in drafts)
                {
                    Console.WriteLine($"[TIMER] Checking draft: {draft.Id}");

                    if (DateTime.UtcNow <= draft.PickDeadline)
                    {
                        Console.WriteLine("[TIMER] Deadline not reached");
                        continue;
                    }

                    Console.WriteLine("[TIMER] Deadline passed → processing");

                    await ProcessDraft(draft.Id, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TIMER ERROR] {ex}");
            }

            await Task.Delay(5000, stoppingToken);
        }
    }

    private async Task ProcessDraft(Guid draftId, CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<FantasyDbContext>();
        var statsDbContext = scope.ServiceProvider.GetRequiredService<StatsDbContext>();

        try
        {
            Console.WriteLine($"[DRAFT] Start processing: {draftId}");

            var draft = await context.DraftSessions.FirstOrDefaultAsync(
                d => d.Id == draftId,
                stoppingToken
            );

            if (draft == null)
            {
                Console.WriteLine("[DRAFT] Draft not found");
                return;
            }

            var currentPick = await context
                .DraftSessions.Where(d => d.Id == draft.Id)
                .SelectMany(d => d.PickOrder)
                .OrderBy(p => p.Order)
                .Skip(draft.CurrentPickIndex)
                .FirstOrDefaultAsync(stoppingToken);

            if (currentPick == null)
            {
                Console.WriteLine("[DRAFT] No more picks → switching phase");

                draft.Phase = DraftPhase.Coach;
                draft.CurrentPickIndex = 0;
                draft.PickDeadline = DateTime.UtcNow;

                await context.SaveChangesAsync(stoppingToken);

                await _hubContext
                    .Clients.Group(draft.Id.ToString())
                    .SendAsync("PhaseChanged", "Coach");

                return;
            }

            var teamId = currentPick.FantasyTeamId;

            Console.WriteLine("[DRAFT] Fetching team players");

            var teamPlayerIds = await context
                .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == teamId)
                .Select(tp => tp.PlayerId)
                .ToListAsync(stoppingToken);

            Console.WriteLine($"[DRAFT] Team players count: {teamPlayerIds.Count}");

            var positionCounts = await statsDbContext
                .Players.Where(p => teamPlayerIds.Contains(p.Id))
                .GroupBy(p => p.Position)
                .Select(g => new { Position = g.Key, Count = g.Count() })
                .ToListAsync(stoppingToken);

            int guards = positionCounts.FirstOrDefault(x => x.Position == "Guard")?.Count ?? 0;
            int forwards = positionCounts.FirstOrDefault(x => x.Position == "Forward")?.Count ?? 0;
            int centers = positionCounts.FirstOrDefault(x => x.Position == "Center")?.Count ?? 0;

            Console.WriteLine($"[DRAFT] G:{guards} F:{forwards} C:{centers}");

            var takenPlayerIds = await context
                .FantasyTeamPlayers.Where(fp => fp.FantasyTeam!.LeagueId == draft.LeagueId)
                .Select(fp => fp.PlayerId)
                .ToListAsync(stoppingToken);

            Console.WriteLine($"[DRAFT] Taken players in league: {takenPlayerIds.Count}");

            var validPlayers = await statsDbContext
                .Players.Where(p =>
                    !takenPlayerIds.Contains(p.Id)
                    && (
                        (p.Position == "Guard" && guards < 4)
                        || (p.Position == "Forward" && forwards < 4)
                        || (p.Position == "Center" && centers < 2)
                    )
                )
                .Select(p => new
                {
                    p.Id,
                    p.Position,
                    p.FirstName,
                    p.LastName,
                })
                .ToListAsync(stoppingToken);

            Console.WriteLine($"[DRAFT] Valid players: {validPlayers.Count}");

            if (!validPlayers.Any())
            {
                Console.WriteLine("[DRAFT] Using fallback players");

                validPlayers = await statsDbContext
                    .Players.Where(p => !takenPlayerIds.Contains(p.Id))
                    .Select(p => new
                    {
                        p.Id,
                        p.Position,
                        p.FirstName,
                        p.LastName,
                    })
                    .ToListAsync(stoppingToken);
            }

            if (!validPlayers.Any())
            {
                Console.WriteLine("[DRAFT] NO PLAYERS LEFT → ending draft");

                draft.Phase = DraftPhase.Coach;
                draft.CurrentPickIndex = 0;
                draft.PickDeadline = DateTime.UtcNow;

                await context.SaveChangesAsync(stoppingToken);
                return;
            }

            var selected = validPlayers[_random.Next(validPlayers.Count)];

            Console.WriteLine($"[DRAFT] Selected player: {selected.Id}");

            context.FantasyTeamPlayers.Add(
                new FantasyTeamPlayer
                {
                    FantasyTeamId = teamId,
                    PlayerId = selected.Id,
                    Position = selected.Position,
                }
            );

            draft.CurrentPickIndex++;
            draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

            await context.SaveChangesAsync(stoppingToken);

            //await _hubContext.Clients.Group(draft.Id.ToString()).SendAsync("AutoPick", selected);

            await _hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("AutoPick", new { player = selected });

            await _hubContext
                .Clients.Group(draft.Id.ToString())
                .SendAsync("TurnChanged", new { draft.CurrentPickIndex, draft.PickDeadline });

            Console.WriteLine("[DRAFT] Finished");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DRAFT ERROR] {ex}");
        }
    }
}
