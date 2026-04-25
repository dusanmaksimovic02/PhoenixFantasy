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
        return await _context.Teams.Include(t => t.coach).ToListAsync();
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
        return await _context
            .CoachGameStats.Include(x => x.Coach)
            .Include(x => x.Game)
            .FirstOrDefaultAsync(x => x.Coach!.Id == coachId && x.Game!.Id == gameId);
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

    public async Task<List<Game>> GetAllGamesForTeam(Guid teamId)
    {
        return await _context
            .Games.Include(g => g.HomeTeam)
            .Include(g => g.GuestTeam)
            .Where(t => t.HomeTeam!.Id == teamId || t.GuestTeam!.Id == teamId)
            .ToListAsync();
    }

    public async Task<List<PlayerStatsDto>> GetTeamAveragePlayerStats(Guid teamId)
    {
        var team = await _context
            .Teams.Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null)
            return new List<PlayerStatsDto>();

        var playerIds = team!.Players!.Select(p => p.Id).ToList();

        var stats = await _context
            .PlayerGameStats.Include(x => x.Player)
            .Where(x => playerIds.Contains(x.PlayerId))
            .ToListAsync();

        var grouped = stats.GroupBy(x => x.PlayerId);

        var result = grouped
            .Select(g =>
            {
                var player = g.First().Player;

                return new PlayerStatsDto
                {
                    PlayerId = g.Key,
                    JerseyNumber = player?.JerseyNumber,
                    FullName = $"{player?.FirstName} {player?.LastName}",

                    Points = g.Average(x => x.Points ?? 0),
                    Assists = g.Average(x => x.Assists ?? 0),
                    Rebounds = g.Average(x => x.Rebounds ?? 0),
                    OffensiveRebounds = g.Average(x => x.OffensiveRebounds ?? 0),
                    DefensiveRebounds = g.Average(x => x.DefensiveRebounds ?? 0),
                    Steals = g.Average(x => x.Steals ?? 0),
                    Turnovers = g.Average(x => x.Turnovers ?? 0),
                    Blocks = g.Average(x => x.Blocks ?? 0),
                    ReceivedBlocks = g.Average(x => x.RecievedBlocks ?? 0),
                    PersonalFouls = g.Average(x => x.PersonalFouls ?? 0),
                    ReceivedFouls = g.Average(x => x.RecievedFouls ?? 0),
                    TechnicalFouls = g.Average(x => x.TechnicalFouls ?? 0),
                    Pir = g.Average(x => x.Pir ?? 0),

                    FreeThrow = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made1p ?? 0),
                        Missed = g.Sum(x => x.Miss1p ?? 0),
                    },

                    TwoPoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made2p ?? 0),
                        Missed = g.Sum(x => x.Miss2p ?? 0),
                    },

                    ThreePoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made3p ?? 0),
                        Missed = g.Sum(x => x.Miss3p ?? 0),
                    },
                };
            })
            .ToList();

        return result;
    }

    public async Task<PlayerStatsDto> GetAveragePlayerStats(Guid playerId)
    {
        var stats = await _context
            .PlayerGameStats.Include(x => x.Player)
            .Where(x => x.PlayerId == playerId)
            .ToListAsync();

        var grouped = stats.GroupBy(x => x.PlayerId);

        var result = grouped
            .Select(g =>
            {
                var player = g.First().Player;

                return new PlayerStatsDto
                {
                    PlayerId = g.Key,
                    JerseyNumber = player?.JerseyNumber,
                    FullName = $"{player?.FirstName} {player?.LastName}",

                    Points = g.Average(x => x.Points ?? 0),
                    Assists = g.Average(x => x.Assists ?? 0),
                    Rebounds = g.Average(x => x.Rebounds ?? 0),
                    OffensiveRebounds = g.Average(x => x.OffensiveRebounds ?? 0),
                    DefensiveRebounds = g.Average(x => x.DefensiveRebounds ?? 0),
                    Steals = g.Average(x => x.Steals ?? 0),
                    Turnovers = g.Average(x => x.Turnovers ?? 0),
                    Blocks = g.Average(x => x.Blocks ?? 0),
                    ReceivedBlocks = g.Average(x => x.RecievedBlocks ?? 0),
                    PersonalFouls = g.Average(x => x.PersonalFouls ?? 0),
                    ReceivedFouls = g.Average(x => x.RecievedFouls ?? 0),
                    TechnicalFouls = g.Average(x => x.TechnicalFouls ?? 0),
                    Pir = g.Average(x => x.Pir ?? 0),

                    FreeThrow = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made1p ?? 0),
                        Missed = g.Sum(x => x.Miss1p ?? 0),
                    },

                    TwoPoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made2p ?? 0),
                        Missed = g.Sum(x => x.Miss2p ?? 0),
                    },

                    ThreePoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made3p ?? 0),
                        Missed = g.Sum(x => x.Miss3p ?? 0),
                    },
                };
            })
            .FirstOrDefault();

        return result!;
    }

    public async Task<object> GetGamesByRound()
    {
        var gamesGrouped = await _context
            .Games.Include(g => g.HomeTeam)
            .Include(g => g.GuestTeam)
            .GroupBy(g => g.Round)
            .Select(group => new { Round = group.Key, Games = group.ToList() })
            .ToListAsync();

        return gamesGrouped;
    }

    public async Task<Game> GetGameById(Guid gameId)
    {
        return await _context
                .Games.Include(g => g.HomeTeam)
                .Include(g => g.GuestTeam)
                .Where(g => g.Id == gameId)
                .FirstOrDefaultAsync()
            ?? new Game();
    }

    public async Task<List<PlayerStatsDto>> GetPlayersStatsFromGame(Guid gameId, Guid teamId)
    {
        var team = await _context
            .Teams.Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null)
            return new List<PlayerStatsDto>();

        var playerIds = team!.Players!.Select(p => p.Id).ToList();

        var stats = await _context
            .PlayerGameStats.Include(x => x.Player)
            .Where(x => x!.Game!.Id == gameId && playerIds.Contains(x.PlayerId))
            .ToListAsync();

        var grouped = stats.GroupBy(x => x.PlayerId);

        var result = grouped
            .Select(g =>
            {
                var player = g.First().Player;

                return new PlayerStatsDto
                {
                    PlayerId = g.Key,
                    JerseyNumber = player?.JerseyNumber,
                    FullName = $"{player?.FirstName} {player?.LastName}",

                    Points = g.Average(x => x.Points ?? 0),
                    Assists = g.Average(x => x.Assists ?? 0),
                    Rebounds = g.Average(x => x.Rebounds ?? 0),
                    OffensiveRebounds = g.Average(x => x.OffensiveRebounds ?? 0),
                    DefensiveRebounds = g.Average(x => x.DefensiveRebounds ?? 0),
                    Steals = g.Average(x => x.Steals ?? 0),
                    Turnovers = g.Average(x => x.Turnovers ?? 0),
                    Blocks = g.Average(x => x.Blocks ?? 0),
                    ReceivedBlocks = g.Average(x => x.RecievedBlocks ?? 0),
                    PersonalFouls = g.Average(x => x.PersonalFouls ?? 0),
                    ReceivedFouls = g.Average(x => x.RecievedFouls ?? 0),
                    TechnicalFouls = g.Average(x => x.TechnicalFouls ?? 0),
                    Pir = g.Average(x => x.Pir ?? 0),

                    FreeThrow = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made1p ?? 0),
                        Missed = g.Sum(x => x.Miss1p ?? 0),
                    },

                    TwoPoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made2p ?? 0),
                        Missed = g.Sum(x => x.Miss2p ?? 0),
                    },

                    ThreePoint = new ShotStatDto
                    {
                        Made = g.Sum(x => x.Made3p ?? 0),
                        Missed = g.Sum(x => x.Miss3p ?? 0),
                    },
                };
            })
            .ToList();

        return result!;
    }
}
