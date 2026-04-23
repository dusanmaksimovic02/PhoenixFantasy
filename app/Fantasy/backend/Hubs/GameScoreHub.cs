using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class GameScoreHub : Hub
{
    public async Task JoinGame(string gameId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        Console.WriteLine($"[GameScoreHub] Client joined game group: {gameId}");
    }

    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        Console.WriteLine($"[GameScoreHub] Client left game group: {gameId}");
    }
}