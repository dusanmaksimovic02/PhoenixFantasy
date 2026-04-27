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
        var payload = new
        {
            gameId = scoreEvent.GameId,
            homeTeamId = scoreEvent.HomeTeamId,
            guestTeamId = scoreEvent.GuestTeamId,
            homeTeamName = scoreEvent.HomeTeamName,
            guestTeamName = scoreEvent.GuestTeamName,
            homeTeamScore = scoreEvent.HomeTeamScore,
            guestTeamScore = scoreEvent.GuestTeamScore,
            gameEnded = scoreEvent.GameEnded,
            timestamp = scoreEvent.Timestamp
        };

        
        await _hubContext.Clients.Group(scoreEvent.HomeTeamId.ToString())
            .SendAsync("GameScoreUpdated", payload);
        await _hubContext.Clients.Group(scoreEvent.GuestTeamId.ToString())
            .SendAsync("GameScoreUpdated", payload);

        Console.WriteLine($"[GameScoreHub] Score pushed: {scoreEvent.HomeTeamName} {scoreEvent.HomeTeamScore} - {scoreEvent.GuestTeamScore} {scoreEvent.GuestTeamName} | Ended: {scoreEvent.GameEnded}");
    }
}