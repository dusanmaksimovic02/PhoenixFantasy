using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Hubs;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyLeagueController : ControllerBase
{
    private FantasyDbContext context { get; set; }
    private readonly IHubContext<CreateDraftHub> hubContext;

    public FantasyLeagueController(FantasyDbContext context, IHubContext<CreateDraftHub> hubContext)
    {
        this.context = context;
        this.hubContext = hubContext;
    }

    /*[HttpPost("AddFantasyLeague")]
    public async Task<IActionResult> AddFantasyLeague([FromBody] AddFantasyLeagueDTO dto)
    {
        
    }*/
    [Authorize]
    [HttpGet("GetToken")]
    public IActionResult GetToken()
    {
        var userId = User.FindFirst("id")?.Value;

        if (userId == null)
        {
            var debugClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(new { message = "ID nije nađen", stigliClaims = debugClaims });
        }

        return Ok(new { message = "Uspeh!", userId = userId });
    }

    private string GenerateJoinCode(int length = 6)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();

        return new string(
            Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray()
        );
    }

    //[Authorize]
    [HttpPost("CreateLeagueWithTeam")]
    public async Task<IActionResult> CreateLeagueWithTeam([FromBody] CreateLeagueWithTeamDTO dto)
    {
        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            var user = await context.Users.FindAsync(dto.UserId);

            if (user == null)
                return NotFound("User not found");

            string joinCode;
            do
            {
                joinCode = GenerateJoinCode();
            } while (await context.FantasyLeagues.AnyAsync(l => l.JoinCode == joinCode));

            var league = new FantasyLeague
            {
                Id = Guid.NewGuid(),
                LeagueName = dto.LeagueName,
                leagueAdminId = dto.UserId,
                JoinCode = joinCode,
            };

            context.FantasyLeagues.Add(league);
            await context.SaveChangesAsync();

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = dto.UserId,
            };
            league.fantasyTeams = [team];

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            await hubContext
                .Clients.Group(league.Id.ToString())
                .SendAsync("CreateDraftStarted", new { });

            return Ok(
                new
                {
                    leagueId = league.Id,
                    leagueName = league.LeagueName,
                    joinCode = league.JoinCode,
                    teamId = team.Id,
                    teamName = team.Name,
                }
            );
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("DeleteLeague/{leagueId}")]
    public async Task<IActionResult> DeleteLeague(Guid leagueId)
    {
        try
        {
            var league = await context
                .FantasyLeagues.Include(l => l.fantasyTeams)
                .FirstOrDefaultAsync(l => l.Id == leagueId);

            if (league == null)
            {
                return NotFound(new { message = $"League with Id: {leagueId} doesn't exists." });
            }

            if (league.fantasyTeams != null && league.fantasyTeams.Count > 0)
            {
                context.FantasyTeams.RemoveRange(league.fantasyTeams);
            }

            context.FantasyLeagues.Remove(league);

            await context.SaveChangesAsync();

            await hubContext.Clients.Group(league.Id.ToString()).SendAsync("DeleteLeague", new { });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("IsDraftStarted/{leagueId}")]
    public async Task<ActionResult<Boolean>> IsDraftStarted(Guid leagueId)
    {
        try
        {
            return Ok(context.DraftSessions.Any(ds => ds.LeagueId == leagueId));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetFantasyLeaguesForUser/{userId}")]
    public async Task<IActionResult> GetFantasyLeaguesForUser(string userId)
    {
        try
        {
            var userTeamInfo = await context
                .FantasyTeams.Where(t => t.UserId == userId)
                .Select(t => new
                {
                    t.Id,
                    t.LeagueId,
                    t.Name,
                })
                .ToListAsync();

            if (userTeamInfo == null || !userTeamInfo.Any())
            {
                return NotFound("Korisnik nije clan nijedne lige.");
            }

            var leaguesIds = userTeamInfo.Select(x => x.LeagueId).ToList();

            var userLeagues = await context
                .FantasyLeagues.Where(l => leaguesIds.Contains(l.Id))
                .Include(t => t.leagueAdmin)
                .Include(t => t.fantasyTeams)
                .ToListAsync();

            var result = userLeagues.Select(l => new
            {
                l.Id,
                l.leagueAdmin,
                l.leagueAdminId,
                l.fantasyTeams,
                l.LeagueName,
                l.JoinCode,
                teamName = userTeamInfo.FirstOrDefault(x => x.LeagueId == l.Id)?.Name,
                teamId = userTeamInfo.FirstOrDefault(x => x.LeagueId == l.Id)?.Id,
                isDraftStarted = context.DraftSessions.Any(ds => ds.LeagueId == l.Id),
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("JoinLeague")]
    public async Task<IActionResult> AddTeamToLeague([FromBody] JoinLeagueDTO dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.JoinCode) || string.IsNullOrWhiteSpace(dto.TeamName))
                return BadRequest("JoinCode i TeamName are obligatory");

            var league = await context.FantasyLeagues.FirstOrDefaultAsync(l =>
                l.JoinCode == dto.JoinCode
            );

            if (league == null)
                return NotFound("League with code doesn't exist");

            var existingTeam = await context.FantasyTeams.FirstOrDefaultAsync(t =>
                t.LeagueId == league.Id && t.UserId == dto.UserId
            );

            if (existingTeam != null)
                return BadRequest("You already have a team in this league");

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = dto.UserId,
            };
            league.fantasyTeams = [team];

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            await hubContext
                .Clients.Group(league.Id.ToString())
                .SendAsync("JoinLeague", new { teamName = team.Name });

            return Ok(
                new
                {
                    message = "Joined successfully",
                    leagueId = league.Id,
                    leagueName = league.LeagueName,
                    joinCode = league.JoinCode,
                    teamId = team.Id,
                    teamName = team.Name,
                }
            );
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetFantasyLeagueParticipant/{leagueId}/")]
    public async Task<ActionResult<IEnumerable<Person>>> GetTeamLeagueParticipant(Guid leagueId)
    {
        try
        {
            var usersIds = await context
                .FantasyTeams.Where(l => l.LeagueId == leagueId)
                .Select(u => u.UserId)
                .ToListAsync();

            var leagueParticipants = await context
                .Users.Where(u => usersIds.Contains(u.Id))
                .ToListAsync();

            if (leagueParticipants == null || !leagueParticipants.Any())
            {
                return NotFound("No participants found for this league.");
            }

            return Ok(leagueParticipants);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetFantasyLeagueAdmin/{leagueId}")]
    public async Task<IActionResult> GetTeamLeagueAdmin(Guid leagueId)
    {
        try
        {
            var userId = await context
                .FantasyLeagues.Where(l => l.Id == leagueId)
                .Select(u => u.leagueAdminId)
                .FirstOrDefaultAsync();

            return Ok(userId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetFantasyLeague/{leagueId}")]
    public async Task<IActionResult> GetTeamLeague(Guid leagueId)
    {
        try
        {
            var league = await context
                .FantasyLeagues.Where(l => l.Id == leagueId)
                .FirstOrDefaultAsync();

            return Ok(league);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetCurrentRound")]
    public async Task<ActionResult<FantasyLeague>> GetCurrentRound()
    {
        try
        {
            var league = await context.FantasyLeagues.FirstOrDefaultAsync();

            return Ok(league);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    //[Authorize]
    [HttpDelete("RemovePlayerFromLeague")]
    public async Task<IActionResult> RemovePlayerFromLeague(
        [FromBody] RemovePlayerFromLeagueDTO dto
    )
    {
        try
        {
            var league = await context.FantasyLeagues.FirstOrDefaultAsync(l =>
                l.Id == dto.LeagueId
            );

            if (league == null)
                return NotFound("League not found");

            // if (league.leagueAdminId != dto.UserId)
            //     return Forbid("Only league admin can remove players");

            var teamId = await context
                .FantasyTeams.Where(t => t.LeagueId == dto.LeagueId && t.UserId == dto.UserId)
                .Select(t => t.Id)
                .FirstOrDefaultAsync();

            var team = await context.FantasyTeams.FirstOrDefaultAsync(t =>
                t.Id == teamId && t.LeagueId == dto.LeagueId
            );

            if (team == null)
                return NotFound("Team not found in this league");

            // if (team.UserId == dto.UserId)
            //     return BadRequest("Admin cannot remove their own team");

            var teamPlayers = await context
                .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == team.Id)
                .ToListAsync();

            context.FantasyTeamPlayers.RemoveRange(teamPlayers);

            context.FantasyTeams.Remove(team);

            await context.SaveChangesAsync();

            await hubContext
                .Clients.Group(league.Id.ToString())
                .SendAsync("RemovePlayerFromLeague", new { dto.UserId });

            return Ok(new { message = "Team removed from league successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetFantasyLeagueStandings/{leagueId}")]
    public async Task<IActionResult> GetFantasyLeagueStandings(Guid leagueId)
    {
        var leagueExists = await context.FantasyLeagues.AnyAsync(l => l.Id == leagueId);

        if (!leagueExists)
            return NotFound("League not found");

        var standings = await context
            .FantasyTeams.Where(t => t.LeagueId == leagueId)
            .Select(t => new FantasyLeagueStandingDto
            {
                TeamName = t.Name,
                TotalPoints =
                    context
                        .FantasyTeamRounds.Where(r => r.fantasyTeam!.Id == t.Id)
                        .Sum(r => (double?)r.roundPoints)
                    ?? 0,
                username = t.User!.UserName,
                userId = t.User!.Id,
            })
            .OrderByDescending(t => t.TotalPoints)
            .ToListAsync();

        return Ok(standings);
    }

    [HttpGet("GetFantasyTeamPoints/{teamId}/{round}")]
    public async Task<IActionResult> GetFantasyTeamPoints(Guid teamId, int round)
    {
        var standings = await context
            .FantasyTeamRounds.Include(t => t.fantasyTeam)
            .Where(t => t.fantasyTeam!.Id == teamId && t.round == round)
            .Select(t => new
            {
                t.Id,
                t.round,
                t.roundPoints,
            })
            .ToListAsync();

        return Ok(standings);
    }
}
