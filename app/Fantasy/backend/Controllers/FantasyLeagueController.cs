using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyLeagueController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public FantasyLeagueController(FantasyDbContext context)
    {
        this.context = context;
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
        Console.WriteLine($"Korisnik autentifikovan: {User.Identity?.IsAuthenticated}");
        Console.WriteLine($"Tip autentifikacije: {User.Identity?.AuthenticationType}");

        var userId =
            User.FindFirst("id")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            var claims = string.Join(", ", User.Claims.Select(c => $"{c.Type}:{c.Value}"));
            Console.WriteLine($"Stigli claimovi: {claims}");
            return Unauthorized("ID nije pronađen u tokenu. Proveri konzolu bekenda.");
        }

        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            //var userId = User.FindFirst("id")?.Value;
            /*var userId = User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Token je validan, ali ID nije pronađen unutar njega.");
            }*/

            var user = await context.Users.FindAsync(userId);

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
                leagueAdminId = userId,
                JoinCode = joinCode,
            };

            context.FantasyLeagues.Add(league);
            await context.SaveChangesAsync();

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = userId,
            };

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

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

    [HttpPost("JoinLeague")]
    public async Task<IActionResult> AddTeamToLeague([FromBody] JoinLeagueDTO dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.JoinCode) || string.IsNullOrWhiteSpace(dto.TeamName))
                return BadRequest("JoinCode i TeamName are obligatory");

            var userId = User.FindFirst("id")?.Value;

            if (userId == null)
                return Unauthorized();

            var league = await context.FantasyLeagues.FirstOrDefaultAsync(l =>
                l.JoinCode == dto.JoinCode
            );

            if (league == null)
                return NotFound("League with code doesn't exist");

            var existingTeam = await context.FantasyTeams.FirstOrDefaultAsync(t =>
                t.LeagueId == league.Id && t.UserId == userId
            );

            if (existingTeam != null)
                return BadRequest("You already have a team in this league");

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = userId,
            };

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            return Ok(
                new
                {
                    message = "Joined succesfully",
                    leagueId = league.Id,
                    leagueName = league.LeagueName,
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

    //[Authorize]
    [HttpDelete("RemovePlayerFromLeague")]
    public async Task<IActionResult> RemovePlayerFromLeague(
        [FromBody] RemovePlayerFromLeagueDTO dto
    )
    {
        try
        {
            var userId =
                User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token");

            var league = await context.FantasyLeagues.FirstOrDefaultAsync(l =>
                l.Id == dto.LeagueId
            );

            if (league == null)
                return NotFound("League not found");

            if (league.leagueAdminId != userId)
                return Forbid("Only league admin can remove players");

            var team = await context.FantasyTeams.FirstOrDefaultAsync(t =>
                t.Id == dto.TeamId && t.LeagueId == dto.LeagueId
            );

            if (team == null)
                return NotFound("Team not found in this league");

            if (team.UserId == userId)
                return BadRequest("Admin cannot remove their own team");

            var teamPlayers = await context
                .FantasyTeamPlayers.Where(tp => tp.FantasyTeamId == team.Id)
                .ToListAsync();

            context.FantasyTeamPlayers.RemoveRange(teamPlayers);

            context.FantasyTeams.Remove(team);

            await context.SaveChangesAsync();

            return Ok(new { message = "Team removed from league successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
