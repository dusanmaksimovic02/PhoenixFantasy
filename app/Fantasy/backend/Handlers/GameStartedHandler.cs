using FantasyApi.Events;
using FantasyApi.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Handlers;

public class GameStartedHandler
{
    private readonly IHubContext<GameScoreHub> _hubContext;

    public GameStartedHandler(IHubContext<GameScoreHub> hubContext)
    {
        _hubContext = hubContext;
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
            timestamp = gameEvent.Timestamp
        };

        
        await _hubContext.Clients.Group(gameEvent.HomeTeamId.ToString())
            .SendAsync("GameStarted", payload);
        await _hubContext.Clients.Group(gameEvent.GuestTeamId.ToString())
            .SendAsync("GameStarted", payload);

        
        await _hubContext.Clients.Group(gameEvent.Round.ToString())
            .SendAsync("GameStarted", payload);

        Console.WriteLine($"[GameScoreHub] GameStarted pushed: {gameEvent.HomeTeamName} vs {gameEvent.GuestTeamName} Round {gameEvent.Round}");
    }
}