using FantasyApi.Data;
using FantasyApi.Hubs;
using FantasyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class DraftTimerService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<DraftHub> _hubContext;

    public DraftTimerService(IServiceScopeFactory scopeFactory, IHubContext<DraftHub> hubContext)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    private static readonly Random _random = new();

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<FantasyDbContext>();
            var statsDbContext = scope.ServiceProvider.GetRequiredService<StatsDbContext>();

            var drafts = await context
                .DraftSessions.Include(d => d.PickOrder)
                .Include(d => d.League)
                    .ThenInclude(l => l!.fantasyTeams)
                .Where(d => d.IsActive && d.Phase == DraftPhase.Player)
                .ToListAsync(stoppingToken);

            foreach (var draft in drafts)
            {
                if (DateTime.UtcNow <= draft.PickDeadline)
                    continue;

                await using var transaction = await context.Database.BeginTransactionAsync(
                    stoppingToken
                );

                try
                {
                    var dbDraft = await context
                        .DraftSessions.Include(d => d.PickOrder)
                        .Include(d => d.League)
                            .ThenInclude(l => l!.fantasyTeams)
                        .FirstOrDefaultAsync(d => d.Id == draft.Id, stoppingToken);

                    if (dbDraft == null)
                        continue;

                    if (dbDraft.CurrentPickIndex >= dbDraft.PickOrder.Count)
                    {
                        dbDraft.Phase = DraftPhase.Coach;
                        dbDraft.CurrentPickIndex = 0;
                        dbDraft.PickDeadline = DateTime.UtcNow;

                        await context.SaveChangesAsync(stoppingToken);
                        await transaction.CommitAsync(stoppingToken);

                        await _hubContext
                            .Clients.Group(dbDraft.Id.ToString())
                            .SendAsync("PhaseChanged", "Coach");

                        continue;
                    }

                    var currentPick = dbDraft.PickOrder.OrderBy(p => p.Order).ToList()[
                        dbDraft.CurrentPickIndex
                    ];

                    var teamId = currentPick.FantasyTeamId;

                    var takenPlayerIds = await context
                        .FantasyTeamPlayers.Select(x => x.PlayerId)
                        .ToListAsync(stoppingToken);

                    var teamPlayerIds = await context
                        .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == teamId)
                        .Select(tp => tp.PlayerId)
                        .ToListAsync(stoppingToken);

                    var positionCounts = await statsDbContext
                        .Players.Where(p => teamPlayerIds.Contains(p.Id))
                        .GroupBy(p => p.Position)
                        .Select(g => new { Position = g.Key, Count = g.Count() })
                        .ToListAsync(stoppingToken);

                    int guards =
                        positionCounts.FirstOrDefault(x => x.Position == "Guard")?.Count ?? 0;
                    int forwards =
                        positionCounts.FirstOrDefault(x => x.Position == "Forward")?.Count ?? 0;
                    int centers =
                        positionCounts.FirstOrDefault(x => x.Position == "Center")?.Count ?? 0;

                    var availablePlayers = await statsDbContext
                        .Players.Where(p => !takenPlayerIds.Contains(p.Id))
                        .ToListAsync(stoppingToken);

                    var validPlayers = availablePlayers
                        .Where(p =>
                            (p.Position == "Guard" && guards < 4)
                            || (p.Position == "Forward" && forwards < 4)
                            || (p.Position == "Center" && centers < 2)
                        )
                        .ToList();

                    Player? selectedPlayer = null;

                    if (validPlayers.Any())
                    {
                        selectedPlayer = validPlayers[_random.Next(validPlayers.Count)];

                        context.FantasyTeamPlayers.Add(
                            new FantasyTeamPlayer
                            {
                                FantasyTeamId = teamId,
                                PlayerId = selectedPlayer.Id,
                                Position = selectedPlayer.Position,
                            }
                        );
                    }

                    dbDraft.CurrentPickIndex++;
                    dbDraft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

                    await context.SaveChangesAsync(stoppingToken);
                    await transaction.CommitAsync(stoppingToken);

                    if (selectedPlayer != null)
                    {
                        await _hubContext
                            .Clients.Group(dbDraft.Id.ToString())
                            .SendAsync("AutoPick", new { player = selectedPlayer });
                    }

                    await _hubContext
                        .Clients.Group(dbDraft.Id.ToString())
                        .SendAsync(
                            "TurnChanged",
                            new { dbDraft.CurrentPickIndex, dbDraft.PickDeadline }
                        );
                }
                catch
                {
                    await transaction.RollbackAsync(stoppingToken);
                }
            }

            await Task.Delay(5000, stoppingToken);
        }
    }
}
