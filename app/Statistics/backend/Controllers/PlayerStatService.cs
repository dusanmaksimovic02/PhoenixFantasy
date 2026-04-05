using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;

using StatsApi.Models;
using StatsApi.Services;
using System.Text.Json;

namespace StatsApi.Controllers;

public class PlayerStatService
{
    private readonly DataContext _context;
    private readonly IRabbitMQService _rabbitMQ;

    public PlayerStatService(DataContext context, IRabbitMQService rabbitMQ)
    {
        _context = context;
        _rabbitMQ = rabbitMQ;
    }

    public async Task UpdateStatAsync(UpdatePlayerStatDto dto)
    {
        // 1. Parsiramo stringove u Guid-ove VAN upita
        // Ako ovo ne uradiš, SQL nekada ne može da iskoristi indeks (Index Scan vs Index Seek)
        if (!Guid.TryParse(dto.PlayerId, out var pId) || !Guid.TryParse(dto.GameId, out var gId))
        {
            throw new Exception("ID format nije validan.");
        }

        // 2. Upit koji je sada munjevito brz zbog indeksa
        var stats = await _context.PlayerGameStats
            .Include(x => x.Game).ThenInclude(g => g!.HomeTeam)
            .Include(x => x.Game).ThenInclude(g => g!.GuestTeam)
            // BITNO: Poredimo Guid sa Guid-om, bez .ToString()
            .FirstOrDefaultAsync(x => x.PlayerId == pId && x.GameId == gId);

        if (stats == null)
            throw new Exception("Statistika nije pronađena.");

        // 3. Logika komande ostaje ista
        foreach (var change in dto.Changes)
        {
            var command = new UpdatePlayerStatCommand(stats, change.StatType, change.Delta);
            command.Execute();
        }

        await _context.SaveChangesAsync();
var playerEvent = new PlayerStatsUpdatedEvent
{
    PlayerId = stats.PlayerId,
    GameId = stats.GameId,

    Points = stats.Points ?? 0,

    Made1p = stats.Made1p ?? 0,
    Miss1p = stats.Miss1p ?? 0,

    Made2p = stats.Made2p ?? 0,
    Miss2p = stats.Miss2p ?? 0,

    Made3p = stats.Made3p ?? 0,
    Miss3p = stats.Miss3p ?? 0,

    Assists = stats.Assists ?? 0,

    Rebounds = stats.Rebounds ?? 0,
    OffensiveRebounds = stats.OffensiveRebounds ?? 0,
    DefensiveRebounds = stats.DefensiveRebounds ?? 0,

    Steals = stats.Steals ?? 0,
    Blocks = stats.Blocks ?? 0,
    RecievedBlocks = stats.RecievedBlocks ?? 0,

    Turnovers = stats.Turnovers ?? 0,

    PersonalFouls = stats.PersonalFouls ?? 0,
    RecievedFouls = stats.RecievedFouls ?? 0,
    TechnicalFouls = stats.TechnicalFouls ?? 0,

    Pir = stats.Pir ?? 0,
    SecondsPlayed = stats.SecondsPlayed ?? 0,

    IsStarter = stats.IsStarter ?? false,

    Timestamp = DateTime.Now
};

        var json = JsonSerializer.Serialize(playerEvent);

        await _rabbitMQ.PublishToExchangeAsync(
            exchangeName: "stats.topic",
            routingKey: "player.stats.updated",
            message: json
        );
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

        return await _context.PlayerGameStats
            .Where(x => x.Game!.Id == gameId &&
                _context.Teams.Any(t => t.Id == teamId && t.Players!.Any(p => p.Id == x.Player!.Id)))
                .Include(x => x.Player)
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