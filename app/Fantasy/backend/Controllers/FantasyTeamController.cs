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

        var oldTeamPlayer = await context.FantasyTeamPlayers.FirstOrDefaultAsync(tp =>
            tp.FantasyTeamId == dto.FantasyTeamId && tp.PlayerId == dto.OldPlayerId
        );

        if (oldTeamPlayer == null)
            return BadRequest("Igrač nije pronađen u tvom timu");

        var isNewPlayerActiveSomewhere = await context.FantasyTeamPlayers.AnyAsync(x =>
            x.PlayerId == dto.NewPlayerId && x.IsActive
        );

        if (isNewPlayerActiveSomewhere)
            return BadRequest("Igrač je već u nekom timu");

        oldTeamPlayer.IsActive = false;

        var existingInactiveRecord = await context
            .FantasyTeamPlayers.IgnoreQueryFilters()
            .FirstOrDefaultAsync(tp =>
                tp.FantasyTeamId == dto.FantasyTeamId && tp.PlayerId == dto.NewPlayerId
            );

        if (existingInactiveRecord != null)
        {
            existingInactiveRecord.IsActive = true;
            existingInactiveRecord.Position = dto.NewPlayerPosition;
            existingInactiveRecord.Role = oldTeamPlayer.Role;
        }
        else
        {
            context.FantasyTeamPlayers.Add(
                new FantasyTeamPlayer
                {
                    FantasyTeamId = dto.FantasyTeamId,
                    PlayerId = dto.NewPlayerId,
                    Position = dto.NewPlayerPosition,
                    Role = oldTeamPlayer.Role,
                    IsActive = true,
                }
            );
        }

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
                playerId = p.Id,
                p.FirstName,
                p.LastName,
                p.JerseyNumber,
                p.Position,
            })
            .ToListAsync();

        return Ok(freePlayers);
    }

    [HttpGet("GetAllFreePlayersSorted/{leagueId}")]
    public async Task<IActionResult> GetAllFreePlayersSorted(Guid leagueId)
    {
        var takenPlayerIds = await context
            .FantasyTeamPlayers.Where(tp => tp.FantasyTeam!.LeagueId == leagueId)
            .Select(tp => tp.PlayerId)
            .ToListAsync();

        var teams = await statsDbContext
            .Teams.Include(t => t.Players)
            .Where(t => t.Players != null && t.Players.Any(p => takenPlayerIds.Contains(p.Id)))
            .ToListAsync();

        var freePlayers = await statsDbContext
            .Players.Where(p => !takenPlayerIds.Contains(p.Id))
            .Select(p => new
            {
                PlayerId = p.Id,
                p.FirstName,
                p.LastName,
                p.JerseyNumber,
                p.Position,
                AvgPoints = statsDbContext
                    .PlayerGameStats.Where(s => s.PlayerId == p.Id)
                    .Average(s => (double?)s.Pir)
                    ?? 0.0,
            })
            .OrderByDescending(p => p.AvgPoints)
            .ToListAsync();

        var players = freePlayers
            .Select(p => new
            {
                PlayerId = p.PlayerId,
                p.FirstName,
                p.LastName,
                p.JerseyNumber,
                p.Position,
                p.AvgPoints,
                TeamName = teams
                    .FirstOrDefault(t => t.Players!.Any(pl => pl.Id == p.PlayerId))
                    ?.Name,
            })
            .OrderByDescending(p => p.AvgPoints)
            .ToList();

        return Ok(players);
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
        var takenCoachesIds = await context
            .FantasyTeamCoaches.Where(tp => tp.FantasyTeam!.LeagueId == leagueId)
            .Select(tp => tp.CoachId)
            .ToListAsync();

        var freeCoaches = await statsDbContext
            .Teams.Where(t => !takenCoachesIds.Contains(t.coach!.Id))
            .Select(t => new
            {
                coachId = t.coach!.Id,
                firstName = t.coach!.FirstName,
                lastName = t.coach!.LastName,
                teamName = t.Name,
            })
            .ToListAsync();

        // var freeCoaches = await statsDbContext
        //     .Coaches.Where(c => !takenCoachesIds.Contains(c.Id))
        //     .Select(c => new
        //     {
        //         c.Id,
        //         c.FirstName,
        //         c.LastName,
        //     })
        //     .ToListAsync();

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

        var starter = await context.FantasyTeamPlayers.FirstOrDefaultAsync(x =>
            x.FantasyTeamId == dto.FantasyTeamId && x.PlayerId == dto.StarterPlayerId
        );

        var bench = await context.FantasyTeamPlayers.FirstOrDefaultAsync(x =>
            x.FantasyTeamId == dto.FantasyTeamId && x.PlayerId == dto.BenchPlayerId
        );

        if (starter == null || bench == null)
            return BadRequest("Igrači nisu pronađeni u timu");

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
            .FantasyTeamPlayers.Where(x => x.FantasyTeamId == fantasyTeamId)
            .Select(x => new { x.Role, x.PlayerId })
            .ToListAsync();

        var playerIds = data.Select(x => x.PlayerId).ToList();

        var players = await statsDbContext
            .Players.Where(p => playerIds.Contains(p.Id))
            .Select(p => new PlayerViewDto
            {
                PlayerId = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                JerseyNumber = p.JerseyNumber,
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
            Starters = data.Where(x =>
                    x.Role == FantasyRole.Starter || x.Role == FantasyRole.Captain
                )
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

        var players = await context
            .FantasyTeamPlayers.Where(x => x.FantasyTeamId == dto.FantasyTeamId)
            .ToListAsync();

        if (!players.Any())
            return BadRequest("Nema igraca u timu");

        var currentCaptain = players.FirstOrDefault(x => x.Role == FantasyRole.Captain);

        var newCaptain = players.FirstOrDefault(x => x.PlayerId == dto.NewCaptainPlayerId);

        if (newCaptain == null)
            return BadRequest("Novi kapiten nije u timu");

        if (newCaptain.Role == FantasyRole.Bench)
            return BadRequest("Bench igrac ne moze biti kapiten");

        if (newCaptain.Role == FantasyRole.Captain)
            return Ok();

        if (currentCaptain != null)
            currentCaptain.Role = FantasyRole.Starter;

        newCaptain.Role = FantasyRole.Captain;

        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("GetPointsForTeam/{teamId}")]
    public async Task<ActionResult> GetPointsForTeam(Guid teamId)
    {
        var team = await context.FantasyTeams.FirstOrDefaultAsync(t => t.Id == teamId);

        if (team == null || team.LeagueId == null)
        {
            return NotFound("Tim ili liga nisu pronađeni.");
        }

        var league = await context.FantasyLeagues.FirstOrDefaultAsync(l => l.Id == team.LeagueId);

        int currentRound = league!.CurrentRound;

        var playerPoints = await context
            .FantasyTeamPlayers.Where(ftp => ftp.FantasyTeamId == teamId)
            .Select(ftp => new
            {
                ftp.PlayerId,
                RoundPoints = context
                    .FantasyPlayerRounds.Include(frp => frp.fantasyPlayer)
                    .Where(fpr =>
                        fpr!.fantasyPlayer!.PlayerId == ftp.PlayerId && fpr.round == currentRound
                    )
                    .Select(fpr => fpr.roundPoints)
                    .FirstOrDefault(),
            })
            .ToListAsync();

        var coachPoints = await context
            .FantasyTeamCoaches.Where(ftc => ftc.FantasyTeamId == teamId)
            .Select(ftc => new
            {
                ftc.CoachId,
                RoundPoints = context
                    .FantasyCoachRounds.Include(p => p.fantasyCoach)
                    .Where(fcr =>
                        fcr.fantasyCoach!.CoachId == ftc.CoachId
                        && fcr.round == currentRound
                        && fcr.fantasyCoach.FantasyTeam!.Id == teamId
                    )
                    .Select(fcr => fcr.roundPoints)
                    .FirstOrDefault(),
            })
            .FirstOrDefaultAsync();

        return Ok(
            new
            {
                Round = currentRound,
                Players = playerPoints,
                Coach = coachPoints,
            }
        );
    }
}
