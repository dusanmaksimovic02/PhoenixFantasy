using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

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

    public async Task<IEnumerable<PlayerGameStats>> GetTeamPlayersFromGame(Guid teamId, Guid gameId)
    {
        // var team = await _context.Teams
        //     .Include(t => t.Players)
        //     .FirstOrDefaultAsync(t => t.Id == teamId);

        // var teamPlayerIds = team!.Players!.Select(p => p.Id).ToList();

        // var players = await _context.PlayerGameStats
        //     .Where(pgs => pgs.Game!.Id == gameId && teamPlayerIds.Contains(pgs.Player!.Id))
        //     .Select(pgs => pgs.Player)
        //     .ToListAsync();

        // return players!;

        return  await _context.PlayerGameStats
            .Where(x => x.Game!.Id == gameId &&
                _context.Teams.Any(t => t.Id == teamId && t.Players!.Any(p => p.Id == x.Player!.Id)))
                .Include(x=>x.Player)
            // .Select(x => x.Player!)
            .ToListAsync();
    }
    public async Task<IEnumerable<Player>> GetTeamStartersFromGame(Guid teamId, Guid gameId)
    {
        var team = await _context.Teams
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        var teamPlayerIds = team!.Players!.Select(p => p.Id).ToList();

        var players = await _context.PlayerGameStats
            .Where(
                pgs => pgs.Game!.Id == gameId && 
                teamPlayerIds.Contains(pgs.Player!.Id) && 
                pgs.IsStarter == true)
            .Select(pgs => pgs.Player)
            .ToListAsync();

        return players!;

        // return await _context.PlayerGameStats
        // .Where(x => x.Game!.Id == gameId && 
        //             x.IsStarter == true &&
        //             _context.Teams.Any(t => t.Id == teamId && t.Players!.Any(p => p.Id == x.Player!.Id)))
        // .Select(pgs => pgs.Player!)
        // .ToListAsync();
    }

    public async Task<IEnumerable<Player>> GetTeamNonStartersFromGame(Guid teamId, Guid gameId)
    {
        var team = await _context.Teams
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        var teamPlayerIds = team!.Players!.Select(p => p.Id).ToList();

        var players = await _context.PlayerGameStats
            .Where(
                pgs => pgs.Game!.Id == gameId && 
                teamPlayerIds.Contains(pgs.Player!.Id) && 
                pgs.IsStarter == false)
            .Select(pgs => pgs.Player)
            .ToListAsync();

        return players!;

        // return await _context.PlayerGameStats
        // .Where(x => x.Game!.Id == gameId && 
        //             x.IsStarter == true &&
        //             _context.Teams.Any(t => t.Id == teamId && t.Players!.Any(p => p.Id == x.Player!.Id)))
        // .Select(pgs => pgs.Player!)
        // .ToListAsync();
    }

    public async Task<PlayerGameStats> GetPlayerStatsFromGame(Guid playerId, Guid gameId)
    {
        var playerStats = await _context.PlayerGameStats
            .Where(x => x.Player!.Id == playerId && x!.Game!.Id == gameId)
            .Include(x => x.Player)
            .Include(x => x.Game)
            .FirstOrDefaultAsync();

        return playerStats!;
    }

    public async Task ChangeStarter(Guid gameId, Guid prevStarter, Guid newStarter)
    {
        var prevStarterStats = await _context.PlayerGameStats
            .Where(x => x.Game!.Id == gameId &&
                x.Player!.Id == prevStarter)
            .FirstOrDefaultAsync();

        var newStarterStats = await _context.PlayerGameStats
            .Where(x => x.Game!.Id == gameId &&
                x.Player!.Id == newStarter)
            .FirstOrDefaultAsync();

        if(prevStarterStats == null || newStarterStats == null)
        {
            return;
        }

        prevStarterStats!.IsStarter = false;
        newStarterStats!.IsStarter = true;

        await _context.SaveChangesAsync();
    }
}




