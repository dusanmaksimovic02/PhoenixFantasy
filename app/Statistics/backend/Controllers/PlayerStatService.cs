using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Events;
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
        if (!Guid.TryParse(dto.PlayerId, out var pId) || !Guid.TryParse(dto.GameId, out var gId))
            throw new Exception("ID format nije validan.");

        var stats = await _context.PlayerGameStats
            .Include(x => x.Game).ThenInclude(g => g!.HomeTeam)
            .Include(x => x.Game).ThenInclude(g => g!.GuestTeam)
            .FirstOrDefaultAsync(x => x.PlayerId == pId && x.GameId == gId);

        if (stats == null)
            throw new Exception("Statistika nije pronađena.");

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

        var playerJson = JsonSerializer.Serialize(playerEvent);

        await _rabbitMQ.PublishToExchangeAsync(
            exchangeName: "stats.topic",
            routingKey: "player.stats.updated",
            message: playerJson
        );

        
        if (stats.Game?.HomeTeam != null && stats.Game?.GuestTeam != null)
        {
            var scoreEvent = new GameScoreUpdatedEvent
            {
                GameId = stats.GameId,
                HomeTeamId = stats.Game.HomeTeam.Id,
                GuestTeamId = stats.Game.GuestTeam.Id,
                HomeTeamName = stats.Game.HomeTeam.Name ?? "",
                GuestTeamName = stats.Game.GuestTeam.Name ?? "",
                HomeTeamScore = stats.Game.HomeTeamScore,
                GuestTeamScore = stats.Game.GuestTeamScore,
                Timestamp = DateTime.Now
            };

            var scoreJson = JsonSerializer.Serialize(scoreEvent);

            
            _ = Task.Run(async () =>
            {
                try
                {
                    await _rabbitMQ.PublishToExchangeAsync(
                        exchangeName: "stats.topic",
                        routingKey: "game.score.updated",
                        message: scoreJson
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RabbitMQ ERROR] Failed to publish score update: {ex.Message}");
                }
            });
        }
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

        if (prevStarterStats == null || newStarterStats == null)
            return;

        prevStarterStats!.IsStarter = false;
        newStarterStats!.IsStarter = true;

        await _context.SaveChangesAsync();
    }
}