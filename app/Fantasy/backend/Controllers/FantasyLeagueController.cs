using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FantasyApi.Data;
using FantasyApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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
    // 1. Pokušaj da uzmeš ID
    var userId = User.FindFirst("id")?.Value;

    if (userId == null)
    {
        // 2. Ako je NULL, vrati listu svih claimova koji su stigli (za debug)
        var debugClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        return Ok(new { message = "ID nije nađen", stigliClaims = debugClaims });
    }

    return Ok(new { message = "Uspeh!", userId = userId });
}

    private string GenerateJoinCode(int length = 6)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();

        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    [Authorize]
    [HttpPost("CreateLeagueWithTeam")]
    public async Task<IActionResult> CreateLeagueWithTeam([FromBody] CreateLeagueWithTeamDTO dto)
    {
        using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            var userId = User.FindFirst("id")?.Value;

            if (userId == null)
                return Unauthorized();

            var user = await context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            string joinCode;
            do
            {
                joinCode = GenerateJoinCode();
            }
            while (await context.FantasyLeagues.AnyAsync(l => l.JoinCode == joinCode));

            var league = new FantasyLeague
            {
                Id = Guid.NewGuid(),
                LeagueName = dto.LeagueName,
                leagueAdminId = userId,
                JoinCode = joinCode
            };

            context.FantasyLeagues.Add(league);
            await context.SaveChangesAsync();

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = userId
            };

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(new
            {
                leagueId = league.Id,
                leagueName = league.LeagueName,
                joinCode = league.JoinCode,
                teamId = team.Id,
                teamName = team.Name
            });
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

            var league = await context.FantasyLeagues
                .FirstOrDefaultAsync(l => l.JoinCode == dto.JoinCode);

            if (league == null)
                return NotFound("League with code doesn't exist");

            var existingTeam = await context.FantasyTeams
                .FirstOrDefaultAsync(t => t.LeagueId == league.Id && t.UserId == userId);

            if (existingTeam != null)
                return BadRequest("You already have a team in this league");

            var team = new FantasyTeam
            {
                Id = Guid.NewGuid(),
                Name = dto.TeamName,
                LeagueId = league.Id,
                UserId = userId
            };

            context.FantasyTeams.Add(team);
            await context.SaveChangesAsync();

            return Ok(new
            {
                message = "Joined succesfully",
                leagueId = league.Id,
                leagueName = league.LeagueName,
                teamId = team.Id,
                teamName = team.Name
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}