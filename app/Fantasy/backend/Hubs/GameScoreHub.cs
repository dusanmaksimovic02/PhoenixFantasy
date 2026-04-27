using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class GameScoreHub : Hub
{
    
    public async Task JoinTeam(string teamId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, teamId);
        Console.WriteLine($"[GameScoreHub] Client joined team group: {teamId}");
    }

    public async Task LeaveTeam(string teamId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, teamId);
        Console.WriteLine($"[GameScoreHub] Client left team group: {teamId}");
    }

   
    public async Task JoinGame(string gameId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        Console.WriteLine($"[GameScoreHub] Client joined game group: {gameId}");
    }

    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
    }

   
    public async Task JoinRound(string round)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, round);
        Console.WriteLine($"[GameScoreHub] Client joined round group: {round}");
    }

    public async Task LeaveRound(string round)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, round);
    }
}