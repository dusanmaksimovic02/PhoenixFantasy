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

    public async Task<List<TeamStandingDto>> GetStandings()
    {
        var games = await _context
            .Games.Include(g => g.HomeTeam)
            .Include(g => g.GuestTeam)
            .ToListAsync();

        var standings = new Dictionary<Guid, TeamStandingDto>();

        foreach (var game in games)
        {
            if (game.HomeTeam == null || game.GuestTeam == null)
                continue;

            var homeId = game.HomeTeam.Id;
            var guestId = game.GuestTeam.Id;

            if (!standings.ContainsKey(homeId))
            {
                standings[homeId] = new TeamStandingDto
                {
                    TeamName = game.HomeTeam.Name,
                    Wins = 0,
                    Losses = 0,
                    TeamId = game.HomeTeam.Id,
                    LogoPathUrl = game.HomeTeam.logoPathURL,
                };
            }

            if (!standings.ContainsKey(guestId))
            {
                standings[guestId] = new TeamStandingDto
                {
                    TeamName = game.GuestTeam.Name,
                    Wins = 0,
                    Losses = 0,
                    TeamId = game.GuestTeam.Id,
                    LogoPathUrl = game.GuestTeam.logoPathURL,
                };
            }

            if (game.HomeTeamScore == 0 && game.GuestTeamScore == 0)
                continue;

            if (game.HomeTeamScore > game.GuestTeamScore)
            {
                standings[homeId].Wins++;
                standings[guestId].Losses++;
            }
            else if (game.GuestTeamScore > game.HomeTeamScore)
            {
                standings[guestId].Wins++;
                standings[homeId].Losses++;
            }
        }

        return standings.Values.OrderByDescending(x => x.Wins).ToList();
    }

    public async Task<List<Player>?> GetPlayersByTeam(Guid teamId)
    {
        var team = await _context
            .Teams.Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null)
            return null;

        return team.Players!.ToList();
    }

    public async Task<Coach?> GetCoachByTeam(Guid teamId)
    {
        var team = await _context
            .Teams.Include(t => t.coach)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team?.coach == null)
            return null;

        return team.coach;
    }
}
