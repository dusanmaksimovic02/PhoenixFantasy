using FantasyApi.Events;
using FantasyApi.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Handlers;

public class GameScoreUpdatedHandler
{
    private readonly IHubContext<GameScoreHub> _hubContext;

    public GameScoreUpdatedHandler(IHubContext<GameScoreHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task HandleAsync(GameScoreUpdatedEvent scoreEvent)
    {
      
        await _hubContext
            .Clients.Group(scoreEvent.GameId.ToString())
            .SendAsync("GameScoreUpdated", new
            {
                gameId = scoreEvent.GameId,
                homeTeamId = scoreEvent.HomeTeamId,
                guestTeamId = scoreEvent.GuestTeamId,
                homeTeamName = scoreEvent.HomeTeamName,
                guestTeamName = scoreEvent.GuestTeamName,
                homeTeamScore = scoreEvent.HomeTeamScore,
                guestTeamScore = scoreEvent.GuestTeamScore,
                timestamp = scoreEvent.Timestamp
            });

        Console.WriteLine($"[GameScoreHub] Score update pushed: {scoreEvent.HomeTeamName} {scoreEvent.HomeTeamScore} - {scoreEvent.GuestTeamScore} {scoreEvent.GuestTeamName}");
    }
}