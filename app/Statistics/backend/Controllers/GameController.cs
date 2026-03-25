using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    private DataContext context { get; set; }

    public GameController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetGameById/{id}")]
    public async Task<IActionResult> GetGameById(Guid id)
    {
        try
        {
                var game = await context.Games
                // .AsNoTracking()
                    // .Include(g => g.HomeTeam)
                    // .ThenInclude(t => t!.coach)
                    .Include(g => g.HomeTeam)
                    // .ThenInclude(t => t!.Players)
                    .Include(g => g.GuestTeam)
                    // .ThenInclude(t => t!.coach)
                    // .Include(g => g.GuestTeam)
                    // .ThenInclude(t => t!.Players)
                    .Include(g => g.Referee)
                    .Where(g => g.Id == id)
                    // .AsSplitQuery()
                    .ToListAsync();
            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetGames")]
    public async Task<IActionResult> GetGames()
    {
        try
        {
            var games = await context.Games
            // .AsNoTracking()
                .Include(g => g.HomeTeam)
                // .ThenInclude(t => t!.coach)
                // .Include(g => g.HomeTeam)
                // .ThenInclude(t => t!.Players)
                // .Include(g => g.GuestTeam)
                // .ThenInclude(t => t!.coach)
                .Include(g => g.GuestTeam)
                // .ThenInclude(t => t!.Players)
                .Include(g => g.Referee)
                // .AsSplitQuery()
                .ToListAsync();

            return Ok(games);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddGame")]
    public async Task<ActionResult> AddGame([FromBody] AddGameDto dto)
    {
        try
        {
            var homeTeam = await context.Teams
                .FirstOrDefaultAsync(t => t.Id == dto.HomeTeamId)
                ?? throw new Exception("Home team not found");

            var guestTeam = await context.Teams
                .FirstOrDefaultAsync(t => t.Id == dto.GuestTeamId)
                ?? throw new Exception("Guest team not found");

            var referee = dto.RefereeId != null
                ? await context.Persons.FirstOrDefaultAsync(r => r.Id == dto.RefereeId)
                : null;

            var game = new Game
            {
                HomeTeam = homeTeam,
                GuestTeam = guestTeam,
                dateTime = dto.dateTime,
                Venue = dto.Venue,
                Referee = referee
            };

            context.Games.Add(game);
            await context.SaveChangesAsync();

            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateGame")]
    public async Task<ActionResult<Game>> UpdateGame([FromBody] UpdateGameDTO game)
    {
        try
        {
            var gameUpdate = await context.Games.FirstOrDefaultAsync(x => x.Id == game.GameId) ?? throw new Exception
            ($"Game with Id {game.GameId} doesn't exist");

            var homeTeam = await context.Teams.FirstOrDefaultAsync(x => x.Id == game.HomeTeamId);

            var guestTeam = await context.Teams.FirstOrDefaultAsync(x => x.Id == game.GuestTeamId);

            var referee = await context.Persons.FirstOrDefaultAsync(x => x.Id == game.RefereeId);
            
            if (homeTeam == null || guestTeam == null || referee == null)
            {
                return BadRequest("One entity doesn't exist!");
            }

            gameUpdate.HomeTeam = homeTeam;
            gameUpdate.GuestTeam = guestTeam;
            gameUpdate.dateTime = game.DateTime;
            gameUpdate.Venue = game.Venue;
            gameUpdate.Referee = referee;

            context.Games.Update(gameUpdate);
            await context.SaveChangesAsync();
            return Ok($"Game with Id {game.GameId} updated successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteGame/{id}")]
    public async Task<ActionResult<Game>> DeleteGame(Guid id)
    {
        try
        {
            var game = await context.Games.FindAsync(id) ?? throw new Exception
            ($"Game with Id {id} doesn't exist");
            context.Games.Remove(game!);
            await context.SaveChangesAsync();
            return Ok(game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("AddRefereeToGame/{refereeId}/{gameId}")]
    public async Task<ActionResult<Game>> AddRefereeToGame(string refereeId, Guid gameId)
    {
        try
        {
            var game = await context.Games
                .Include(g => g.Referee)
                .FirstOrDefaultAsync(g => g.Id == gameId)
                ?? throw new Exception($"Game with Id {gameId} doesn't exist");

            var referee = await context.Persons
                .FirstOrDefaultAsync(r => r.Id == refereeId)
                ?? throw new Exception($"Referee with Id {refereeId} doesn't exist");

            var isBusy = await context.Games.AnyAsync(g =>
                g.Referee != null &&
                g.Referee.Id == refereeId &&
                g.dateTime == game.dateTime);

            if (isBusy)
                throw new Exception("Referee is already assigned to another game at the same time");

            game.Referee = referee;
            await context.SaveChangesAsync();

            return Ok($"Referee {refereeId} successfully added to game {gameId}");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("StartGame")]
    public async Task<IActionResult> StartGame([FromBody] StartGameDto dto)
    {
        try
        {
            if (dto.HomeTeamPlayerIds.Count > 12 || dto.GuestTeamPlayerIds.Count > 12)
                return BadRequest("Maximum 12 players per team allowed");

            if (dto.HomeStartersIds.Count != 5 || dto.GuestStartersIds.Count != 5)
                return BadRequest("Each team must have exactly 5 starters");

            if (!dto.HomeStartersIds.All(id => dto.HomeTeamPlayerIds.Contains(id)) ||
                !dto.GuestStartersIds.All(id => dto.GuestTeamPlayerIds.Contains(id)))
                return BadRequest("Starters must be selected from team players");

            var game = await context.Games
                .Include(g => g.HomeTeam)
                    .ThenInclude(t => t!.coach)
                .Include(g => g.GuestTeam)
                    .ThenInclude(t => t!.coach)
                .FirstOrDefaultAsync(g => g.Id == dto.GameId)
                ?? throw new Exception("Game not found");

            if (game.HomeTeam?.coach == null || game.GuestTeam?.coach == null)
                return BadRequest("Both teams must have a coach before starting the game");

            var alreadyStarted = await context.PlayerGameStats
                .AnyAsync(pgs => pgs.Game!.Id == game.Id);

            if (alreadyStarted)
                return BadRequest("Game already started");

            var coachStatsExist = await context.CoachGameStats
                .AnyAsync(cgs => cgs.Game!.Id == game.Id);

            if (coachStatsExist)
                return BadRequest("Coach stats already created for this game");

            var allPlayerIds = dto.HomeTeamPlayerIds
                .Concat(dto.GuestTeamPlayerIds)
                .Distinct()
                .ToList();

            var players = await context.Players
                .Where(p => allPlayerIds.Contains(p.Id))
                .ToListAsync();

            var stats = new List<PlayerGameStats>();

            foreach (var player in players)
            {
                bool isStarter =
                    dto.HomeStartersIds.Contains(player.Id) ||
                    dto.GuestStartersIds.Contains(player.Id);

                stats.Add(new PlayerGameStats
                {
                    Id = Guid.NewGuid(),
                    Game = game,
                    Player = player,
                    IsStarter = isStarter,
                    SecondsPlayed = 0,

                    Points = 0,
                    Made1p = 0,
                    Miss1p = 0,
                    Made2p = 0,
                    Miss2p = 0,
                    Made3p = 0,
                    Miss3p = 0,
                    Assists = 0,
                    Rebounds = 0,
                    OffensiveRebounds = 0,
                    DefensiveRebounds = 0,
                    Steals = 0,
                    Turnovers = 0,
                    Pir = 0,
                    PersonalFouls = 0,
                    RecievedFouls = 0,
                    Blocks = 0,
                    RecievedBlocks = 0,
                    TechnicalFouls = 0
                });
            }

            var coachStats = new List<CoachGameStats>
            {
                new CoachGameStats
                {
                    Id = Guid.NewGuid(),
                    Game = game,
                    Coach = game.HomeTeam.coach,
                    CoachTechnicalFouls = 0,
                    BenchTechnicalFouls = 0,
                    Difference = 0
                },
                new CoachGameStats
                {
                    Id = Guid.NewGuid(),
                    Game = game,
                    Coach = game.GuestTeam.coach,
                    CoachTechnicalFouls = 0,
                    BenchTechnicalFouls = 0,
                    Difference = 0
                }
            };

            context.PlayerGameStats.AddRange(stats);
            context.CoachGameStats.AddRange(coachStats);

            await context.SaveChangesAsync();

            return Ok(new
            {
                message = "Game started successfully",
                homePlayers = dto.HomeTeamPlayerIds.Count,
                guestPlayers = dto.GuestTeamPlayerIds.Count
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


}