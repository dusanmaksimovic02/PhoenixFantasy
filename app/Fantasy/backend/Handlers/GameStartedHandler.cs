using FantasyApi.Data;
using FantasyApi.Events;
using FantasyApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Handlers;

public class GameStartedHandler
{
    private readonly IHubContext<GameStartedHub> _hubContext;
    private FantasyDbContext context { get; set; }
    private readonly StatsDbContext statsDbContext;

    public GameStartedHandler(
        IHubContext<GameStartedHub> hubContext,
        FantasyDbContext context,
        StatsDbContext statsDbContext
    )
    {
        _hubContext = hubContext;
        this.context = context;
        this.statsDbContext = statsDbContext;
    }

    public async Task HandleAsync(GameStartedEvent gameEvent)
    {
        var payload = new
        {
            gameId = gameEvent.GameId,
            homeTeamId = gameEvent.HomeTeamId,
            guestTeamId = gameEvent.GuestTeamId,
            homeTeamName = gameEvent.HomeTeamName,
            guestTeamName = gameEvent.GuestTeamName,
            round = gameEvent.Round,
            dateTime = gameEvent.DateTime,
            venue = gameEvent.Venue,
            timestamp = gameEvent.Timestamp,
        };

        await _hubContext
            .Clients.Group(gameEvent.Round.ToString())
            .SendAsync("GameStarted", payload);

        await _hubContext
            .Clients.Group(gameEvent.HomeTeamId.ToString())
            .SendAsync("GameStarted", payload);

        await _hubContext
            .Clients.Group(gameEvent.GuestTeamId.ToString())
            .SendAsync("GameStarted", payload);

        Console.WriteLine(
            $"[GameStartedHub] Game started: {gameEvent.HomeTeamName} vs {gameEvent.GuestTeamName} — Round {gameEvent.Round}"
        );

        /*var stats = await statsDbContext
            .PlayerGameStats.Where(s => s.GameId == gameEvent.GameId)
            .ToListAsync();

        if (!stats.Any())
        {
            Console.WriteLine("[GameStartedHandler] No stats found yet.");
            return;
        }

        var fantasyRounds = await context
            .FantasyPlayerRounds.Include(f => f.fantasyPlayer)
            .Where(f => f.round == gameEvent.Round)
            .ToListAsync();

        foreach (var fpr in fantasyRounds)
        {
            var stat = stats.FirstOrDefault(s => s.PlayerId == fpr.fantasyPlayer!.PlayerId);

            if (stat != null)
            {
                fpr.PlayerGameStats = stat;
            }
        }

        await context.SaveChangesAsync();

        Console.WriteLine("[GameStartedHandler] Linking finished.");*/
    }
}
