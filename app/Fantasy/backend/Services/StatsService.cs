using FantasyApi.Data;
using FantasyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Services;

public class StatsService
{
    private readonly StatsDbContext _context;

    public StatsService(StatsDbContext context)
    {
        _context = context;
    }

    public async Task<List<Team>> GetAllTeams()
    {
        return await _context.Teams.ToListAsync();
    }

    public async Task<List<Player>> GetAllPlayers()
    {
        return await _context.Players.ToListAsync();
    }

    public async Task<List<Coach>> GetAllCoaches()
    {
        return await _context.Coaches.ToListAsync();
    }

    public async Task<List<Game>> GetAllGames()
    {
        return await _context.Games.ToListAsync();
    }

    public async Task<PlayerGameStats?> GetPlayerGameStats(Guid playerId, Guid gameId)
    {
        return await _context.PlayerGameStats.FirstOrDefaultAsync(x =>
            x.Player!.Id == playerId && x.Game!.Id == gameId
        );
    }

    public async Task<CoachGameStats?> GetCoachGameStats(Guid coachId, Guid gameId)
    {
        return await _context.CoachGameStats.FirstOrDefaultAsync(x =>
            x.Coach!.Id == coachId && x.Game!.Id == gameId
        );
    }
}
