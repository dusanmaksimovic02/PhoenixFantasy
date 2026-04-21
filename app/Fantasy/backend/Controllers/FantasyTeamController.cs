using FantasyApi.Data;
using FantasyApi.Enums;
using FantasyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyTeamController : ControllerBase
{
    private FantasyDbContext context { get; set; }
    private readonly StatsDbContext statsDbContext;

    public FantasyTeamController(FantasyDbContext context, StatsDbContext statsDbContext)
    {
        this.context = context;
        this.statsDbContext = statsDbContext;
    }

    [HttpPost("AddFantasyTeam")]
    public async Task<IActionResult> AddFantasyTeam([FromBody] AddFantasyTeamDTO dto)
    {
        var team = new FantasyTeam
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            LeagueId = dto.LeagueId,
            UserId = dto.UserId,
        };

        context.FantasyTeams.Add(team);
        await context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpGet("GetFantasyTeams")]
    public async Task<IActionResult> GetFantasyTeams()
    {
        var teams = await context.FantasyTeams.Include(t => t.User).ToListAsync();

        return Ok(teams);
    }

    [HttpGet("GetFantasyTeamById/{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var team = await context
            .FantasyTeams.Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
            return NotFound();

        return Ok(team);
    }

    [HttpPut("UpdateFantasyTeam/{id}")]
    public async Task<IActionResult> UpdateFantasyTeam(Guid id, [FromBody] AddFantasyTeamDTO dto)
    {
        var team = await context.FantasyTeams.FindAsync(id);

        if (team == null)
            return NotFound();

        team.Name = dto.Name;
        //team.LeagueId = dto.LeagueId;
        //team.UserId = dto.UserId;

        await context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpDelete("DeleteFantasyTeam/{id}")]
    public async Task<IActionResult> DeleteFantasyTeam(Guid id)
    {
        var team = await context.FantasyTeams.FindAsync(id);

        if (team == null)
            return NotFound();

        context.FantasyTeams.Remove(team);
        await context.SaveChangesAsync();

        return Ok("Deleted successfully");
    }

    [HttpPost("TradePlayer")]
    public async Task<IActionResult> TradePlayer(TradePlayerDto dto)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable
        );
        var team = await context.FantasyTeams.FirstOrDefaultAsync(t => t.Id == dto.FantasyTeamId);

        if (team == null)
            return BadRequest("Tim ne postoji");

        var league = await context.FantasyLeagues.FirstOrDefaultAsync(l => l.Id == team.LeagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.IsRoundActive)
            return BadRequest("Trade nije dozvoljen dok je runda aktivna");

        var teamPlayer = await context.FantasyTeamPlayers.FirstOrDefaultAsync(tp =>
            tp.FantasyTeamId == dto.FantasyTeamId && tp.PlayerId == dto.OldPlayerId
        );

        if (teamPlayer == null)
            return BadRequest("Igrač ne postoji");

        var exists = await context.FantasyTeamPlayers.AnyAsync(x => x.PlayerId == dto.NewPlayerId);

        if (exists)
            return BadRequest("Igrač je već u nekom timu");

        context.FantasyTeamPlayers.Remove(teamPlayer);

        context.FantasyTeamPlayers.Add(
            new FantasyTeamPlayer
            {
                FantasyTeamId = dto.FantasyTeamId,
                PlayerId = dto.NewPlayerId,
                Position = dto.NewPlayerPosition,
            }
        );

        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok();
    }

    [HttpPost("TradeCoach")]
    public async Task<IActionResult> TradeCoach(TradeCoachDto dto)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable
        );

        var team = await context.FantasyTeams.FirstOrDefaultAsync(t => t.Id == dto.FantasyTeamId);

        if (team == null)
            return BadRequest("Tim ne postoji");

        var league = await context.FantasyLeagues.FirstOrDefaultAsync(l => l.Id == team.LeagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.IsRoundActive)
            return BadRequest("Trade nije dozvoljen dok je runda aktivna");

        var teamCoach = await context.FantasyTeamCoaches.FirstOrDefaultAsync(tc =>
            tc.FantasyTeamId == dto.FantasyTeamId && tc.CoachId == dto.OldCoachId
        );

        if (teamCoach == null)
            return BadRequest("Trener u timu ne postoji");

        var exists = await context.FantasyTeamCoaches.AnyAsync(x => x.CoachId == dto.NewCoachId);

        if (exists)
            return BadRequest("Trener je već u nekom timu");

        context.FantasyTeamCoaches.Remove(teamCoach);

        context.FantasyTeamCoaches.Add(
            new FantasyTeamCoach { FantasyTeamId = dto.FantasyTeamId, CoachId = dto.NewCoachId }
        );

        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok();
    }

    [HttpGet("GetAllFreePlayers/{leagueId}")]
    public async Task<IActionResult> GetAllFreePlayers(Guid leagueId)
    {
        var takenPlayerIds = await context
            .FantasyTeamPlayers.Where(tp => tp.FantasyTeam!.LeagueId == leagueId)
            .Select(tp => tp.PlayerId)
            .ToListAsync();

        var freePlayers = await statsDbContext
            .Players.Where(p => !takenPlayerIds.Contains(p.Id))
            .Select(p => new
            {
                p.Id,
                p.FirstName,
                p.LastName,
                p.JerseyNumber,
                p.Position,
            })
            .ToListAsync();

        return Ok(freePlayers);
    }

    [HttpGet("GetAllFreePlayersByPosition/{leagueId}")]
    public async Task<IActionResult> GetAllFreePlayersByPosition(Guid leagueId, string position)
    {
        var takenPlayerIds = await context
            .FantasyTeamPlayers.Where(tp => tp.FantasyTeam!.LeagueId == leagueId)
            .Select(tp => tp.PlayerId)
            .ToListAsync();

        var freePlayers = await statsDbContext
            .Players.Where(p => !takenPlayerIds.Contains(p.Id) && p.Position == position)
            .Select(p => new
            {
                p.Id,
                p.FirstName,
                p.LastName,
                p.JerseyNumber,
                p.Position,
            })
            .ToListAsync();

        return Ok(freePlayers);
    }

    [HttpGet("GetAllFreeCoaches/{leagueId}")]
    public async Task<IActionResult> GetAllFreeCoaches(Guid leagueId)
    {
        var freeCoaches = await statsDbContext
            .Coaches.Where(c =>
                !context
                    .FantasyTeamCoaches.Where(tc => tc.FantasyTeam!.LeagueId == leagueId)
                    .Select(tc => tc.CoachId)
                    .Contains(c.Id)
            )
            .Select(c => new
            {
                c.Id,
                c.FirstName,
                c.LastName,
            })
            .ToListAsync();

        return Ok(freeCoaches);
    }

    [HttpPost("SwitchPlayers")]
    public async Task<IActionResult> SwitchPlayers(SwitchPlayersDto dto)
    {
        var team = await context.FantasyTeams.FirstOrDefaultAsync(t => t.Id == dto.FantasyTeamId);

        if (team == null)
            return BadRequest("Tim ne postoji");

        var league = await context.FantasyLeagues.FirstOrDefaultAsync(l => l.Id == team.LeagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.IsRoundActive)
            return BadRequest("Switch nije dozvoljen dok je runda aktivna");

        var starter = await context
            .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
            .FirstOrDefaultAsync(x =>
                x.fantasyPlayer!.FantasyTeamId == dto.FantasyTeamId
                && x.fantasyPlayer.PlayerId == dto.StarterPlayerId
            );

        var bench = await context
            .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
            .FirstOrDefaultAsync(x =>
                x.fantasyPlayer!.FantasyTeamId == dto.FantasyTeamId
                && x.fantasyPlayer.PlayerId == dto.BenchPlayerId
            );

        if (starter == null || bench == null)
            return BadRequest("Igrači nisu pronađeni u rundi");

        if (starter.Role != FantasyRole.Starter || bench.Role != FantasyRole.Bench)
            return BadRequest("Neispravna zamena (role mismatch)");

        starter.Role = FantasyRole.Bench;
        bench.Role = FantasyRole.Starter;

        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("GetLineup/{fantasyTeamId}")]
    public async Task<IActionResult> GetLineup(Guid fantasyTeamId)
    {
        var data = await context
            .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
            .Where(x => x.fantasyPlayer!.FantasyTeamId == fantasyTeamId)
            .Select(x => new { x.Role, x.fantasyPlayer!.PlayerId })
            .ToListAsync();

        var playerIds = data.Select(x => x.PlayerId).ToList();

        var players = await statsDbContext
            .Players.Where(p => playerIds.Contains(p.Id))
            .Select(p => new PlayerViewDto
            {
                PlayerId = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Position = p.Position!,
            })
            .ToListAsync();

        var coachId = await context
            .FantasyTeamCoaches.Where(c => c.FantasyTeamId == fantasyTeamId)
            .Select(c => c.CoachId)
            .FirstOrDefaultAsync();

        var coach = await statsDbContext
            .Coaches.Where(c => c.Id == coachId)
            .Select(c => new CoachViewDto
            {
                CoachId = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
            })
            .FirstOrDefaultAsync();

        var result = new TeamLineupDto
        {
            Starters = data.Where(x => x.Role == FantasyRole.Starter)
                .Select(x => players.First(p => p.PlayerId == x.PlayerId))
                .ToList(),

            Bench = data.Where(x => x.Role == FantasyRole.Bench)
                .Select(x => players.First(p => p.PlayerId == x.PlayerId))
                .ToList(),

            Captain = players.FirstOrDefault(p =>
                data.Any(x => x.PlayerId == p.PlayerId && x.Role == FantasyRole.Captain)
            ),
            Coach = coach,
        };

        return Ok(result);
    }

    [HttpGet("GetDraftTeamStatus/{fantasyTeamId}")]
    public async Task<IActionResult> GetDraftTeamStatus(Guid fantasyTeamId)
    {
        var pickedIds = await context
            .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == fantasyTeamId)
            .Select(tp => tp.PlayerId)
            .ToListAsync();

        var allPlayers = await statsDbContext
            .Players.Where(p => pickedIds.Contains(p.Id))
            .Select(p => new PlayerViewDto
            {
                PlayerId = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Position = p.Position ?? "N/A",
                JerseyNumber = p.JerseyNumber,
            })
            .ToListAsync();

        var starters = new List<PlayerViewDto>();
        var bench = new List<PlayerViewDto>();

        var guards = allPlayers.Where(p => p.Position == "Guard").ToList();
        var forwards = allPlayers.Where(p => p.Position == "Forward").ToList();
        var centers = allPlayers.Where(p => p.Position == "Center").ToList();

        starters.AddRange(guards.Take(2));
        starters.AddRange(forwards.Take(2));
        starters.AddRange(centers.Take(1));

        var starterIds = starters.Select(s => s.PlayerId).ToHashSet();
        bench = allPlayers.Where(p => !starterIds.Contains(p.PlayerId)).ToList();

        var coachId = await context
            .FantasyTeamCoaches.Where(c => c.FantasyTeamId == fantasyTeamId)
            .Select(c => c.CoachId)
            .FirstOrDefaultAsync();

        CoachViewDto? coach = null;
        if (coachId != Guid.Empty)
        {
            coach = await statsDbContext
                .Coaches.Where(c => c.Id == coachId)
                .Select(c => new CoachViewDto
                {
                    CoachId = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                })
                .FirstOrDefaultAsync();
        }

        return Ok(
            new TeamLineupDto
            {
                Starters = starters,
                Bench = bench,
                Captain = starters.FirstOrDefault(),
                Coach = coach,
            }
        );
    }

    [HttpPost("ChangeCaptain")]
    public async Task<IActionResult> ChangeCaptain(ChangeCaptainDto dto)
    {
        var team = await context.FantasyTeams.FirstOrDefaultAsync(t => t.Id == dto.FantasyTeamId);

        if (team == null)
            return BadRequest("Tim ne postoji");

        var league = await context.FantasyLeagues.FirstOrDefaultAsync(l => l.Id == team.LeagueId);

        if (league == null)
            return BadRequest("Liga ne postoji");

        if (league.IsRoundActive)
            return BadRequest("Promena kapitena nije dozvoljena tokom runde");

        var currentRound = league.CurrentRound;

        var players = await context
            .FantasyPlayerRounds.Include(x => x.fantasyPlayer)
            .Where(x =>
                x.fantasyPlayer!.FantasyTeamId == dto.FantasyTeamId && x.round == currentRound
            )
            .ToListAsync();

        if (!players.Any())
            return BadRequest("Nema igraca u rundi");

        var currentCaptain = players.FirstOrDefault(x => x.Role == FantasyRole.Captain);

        var newCaptain = players.FirstOrDefault(x =>
            x.fantasyPlayer!.PlayerId == dto.NewCaptainPlayerId
        );

        if (newCaptain == null)
            return BadRequest("Novi kapiten nije u timu");

        if (newCaptain.Role == FantasyRole.Bench)
            return BadRequest("Bench igrac ne moze biti kapiten");

        if (currentCaptain != null)
            currentCaptain.Role = FantasyRole.Starter;

        newCaptain.Role = FantasyRole.Captain;

        await context.SaveChangesAsync();

        return Ok();
    }
}
