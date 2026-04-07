using Microsoft.AspNetCore.SignalR;

namespace FantasyApi.Hubs;

public class DraftHub : Hub
{
    public async Task JoinDraft(Guid draftId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, draftId.ToString());
    }
}
