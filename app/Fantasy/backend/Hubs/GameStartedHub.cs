using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class GameStartedHub : Hub
{
   
    public async Task JoinRound(string round)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, round);
        Console.WriteLine($"[GameStartedHub] Client joined round group: {round}");
    }

    
    public async Task JoinTeam(string teamId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, teamId);
        Console.WriteLine($"[GameStartedHub] Client joined team group: {teamId}");
    }

    public async Task LeaveRound(string round)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, round);
    }

    public async Task LeaveTeam(string teamId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, teamId);
    }
}