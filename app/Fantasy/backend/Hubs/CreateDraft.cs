using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class CreateDraftHub : Hub
{
    public async Task JoinCreateDraft(string leagueId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, leagueId);
    }
}
