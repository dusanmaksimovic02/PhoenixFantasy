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

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<FantasyDbContext>();

            var drafts = await context
                .DraftSessions.Include(d => d.League)
                    .ThenInclude(l => l!.fantasyTeams)
                .Where(d => d.IsActive)
                .ToListAsync(stoppingToken);

            foreach (var draft in drafts)
            {
                if (DateTime.UtcNow > draft.PickDeadline)
                {
                    draft.CurrentPickIndex =
                        (draft.CurrentPickIndex + 1) % draft.League!.fantasyTeams!.Count;
                    draft.PickDeadline = DateTime.UtcNow.AddMinutes(1);

                    await _hubContext
                        .Clients.Group(draft.Id.ToString())
                        .SendAsync(
                            "PickSkipped",
                            new { draft.CurrentPickIndex, draft.PickDeadline }
                        );
                }
            }

            await context.SaveChangesAsync();

            await Task.Delay(5000);
        }
    }
}
