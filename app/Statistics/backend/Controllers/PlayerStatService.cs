using Microsoft.EntityFrameworkCore;
using StatsApi.Data;

namespace StatsApi.Controllers;

public class PlayerStatService
{
    private readonly DataContext _context;

    public PlayerStatService(DataContext context)
    {
        _context = context;
    }

    public async Task UpdateStatAsync(UpdatePlayerStatDto dto)
    {
        var stats = await _context.PlayerGameStats
            .Include(x => x.Player)
            .Include(x => x.Game)
            .FirstOrDefaultAsync(x =>
                x.Player!.Id.ToString() == dto.PlayerId &&
                x.Game!.Id.ToString() == dto.GameId
            );

        if (stats == null)
            throw new Exception("Stats for player and game not found");

        foreach (var change in dto.Changes)
        {
            var command = new UpdatePlayerStatCommand(
                stats,
                change.StatType,
                change.Delta
            );

            command.Execute();
        }

        await _context.SaveChangesAsync();
    }
}




