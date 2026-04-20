using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class FantasyHub : Hub
{
    public async Task JoinTeamGroup(string fantasyTeamId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, fantasyTeamId);
    }
}
