using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StatsApi.Data;
using StatsApi.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TeamController : ControllerBase
{
    private DataContext context { get; set; }

    public TeamController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet("GetTeamById/{id}")]
    public async Task<IActionResult> GetTeamById(string id)
    {
        try
        {
            var team = await context.Teams.FirstOrDefaultAsync(x => x.Id.ToString() == id) ?? throw new Exception
            ($"Team with Id {id} doesn't exist");
            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("GetTeams")]
    public async Task<IActionResult> GetTeams()
    {
        try
        {
            var teams = await context.Teams.Include(t => t.Players).Include(t => t.coach).ToListAsync();
            return Ok(teams);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPost("AddTeam")]
    public async Task<ActionResult<Team>> AddTeam([FromBody] CreateTeamDto dto)
    {
        try
        {
            var coach = await context.Coaches
                .FirstOrDefaultAsync(c => c.Id == dto.CoachId)
                ?? throw new Exception($"Coach with Id {dto.CoachId} doesn't exist");

            var players = new List<Player>();

            foreach (var playerId in dto.PlayerIds)
            {
                var player = await context.Players
                    .FirstOrDefaultAsync(p => p.Id == playerId)
                    ?? throw new Exception($"Player with Id {playerId} doesn't exist");

                players.Add(player);
            }

            var team = new Team
            {
                Name = dto.Name,
                coach = coach,
                Players = new List<Player>()
            };

            team.Players = players;

            context.Teams.Add(team);
            await context.SaveChangesAsync();

            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateTeam")]
    public async Task<ActionResult<Team>> UpdateTeam([FromBody] Team team)
    {
        try
        {
            var teamUpdate = await context.Teams.FirstOrDefaultAsync(x => x.Id == team.Id) ?? throw new Exception
            ($"Team with Id {team.Id} doesn't exist");
            context.Teams.Update(teamUpdate);
            await context.SaveChangesAsync();
            return Ok($"Team with Id {team.Id} updated succesfuly");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("DeleteTeam/{id}")]
    public async Task<ActionResult<Team>> DeleteTeam(Guid id)
    {
        try
        {
            var team = await context.Teams.FindAsync(id) ?? throw new Exception
            ($"Team with Id {id} doesn't exist");
            context.Teams.Remove(team!);
            await context.SaveChangesAsync();
            return Ok(team);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpPut("AddPlayerToTeam/{playerId}/{teamId}")]
    public async Task<ActionResult<Team>> AddPlayerToTeam(string playerId, string teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            var player = await context.Players
                .FirstOrDefaultAsync(p => p.Id.ToString() == playerId)
                ?? throw new Exception($"Player with Id {playerId} doesn't exist");

            if (team.Players == null)
                team.Players = new List<Player>();

            if (team.Players.Any(p => p.Id == player.Id))
                throw new Exception("Player is already in the team");

            if (!string.IsNullOrEmpty(player.JerseyNumber) &&
                team.Players.Any(p => p.JerseyNumber!.ToUpper() == player.JerseyNumber.ToUpper()))
            {
                throw new Exception($"Jersey number {player.JerseyNumber} is already taken in this team");
            }

            team.Players.Add(player);
            await context.SaveChangesAsync();

            return Ok($"Player with Id {playerId} added to team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("AddPlayersToTeam/{teamId}")]
    public async Task<ActionResult<Team>> AddPlayersToTeam(string teamId, [FromBody] List<Guid> playerIds)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            if (team.Players == null)
                team.Players = new List<Player>();

            foreach (var playerId in playerIds)
            {
                var player = await context.Players
                    .FirstOrDefaultAsync(p => p.Id == playerId)
                    ?? throw new Exception($"Player with Id {playerId} doesn't exist");

                if (team.Players.Any(p => p.Id == player.Id))
                    throw new Exception($"Player with Id {playerId} is already in the team");

                if (!string.IsNullOrEmpty(player.JerseyNumber) &&
                    team.Players.Any(p => p.JerseyNumber!.ToUpper() == player.JerseyNumber.ToUpper()))
                {
                    throw new Exception($"Jersey number {player.JerseyNumber} is already taken in this team");
                }

                team.Players.Add(player);
            }

            await context.SaveChangesAsync();

            return Ok($"Players added to team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetTeamPlayers/{teamId}")]
    public async Task<ActionResult<List<Player>>> GetTeamPlayers(Guid teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            return Ok(team!.Players);
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("AddCoachToTeam/{coachId}/{teamId}")]
    public async Task<ActionResult> AddCoachToTeam(string coachId, string teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.coach)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            var coach = await context.Coaches
                .FirstOrDefaultAsync(c => c.Id.ToString() == coachId)
                ?? throw new Exception($"Coach with Id {coachId} doesn't exist");

            if (team.coach != null)
                throw new Exception("Team already has a coach");

            team.coach = coach;

            await context.SaveChangesAsync();

            return Ok($"Coach with Id {coachId} added to team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("UpdateCoach/{coachId}/{teamId}")]
    public async Task<ActionResult> UpdateCoach(string coachId, string teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.coach)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            var coach = await context.Coaches
                .FirstOrDefaultAsync(c => c.Id.ToString() == coachId)
                ?? throw new Exception($"Coach with Id {coachId} doesn't exist");

            team.coach = coach;

            await context.SaveChangesAsync();

            return Ok($"Coach with Id {coachId} updated for team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [HttpPut("RemoveCoachFromTeam/{teamId}")]
    public async Task<ActionResult> RemoveCoachFromTeam(string teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.coach)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            if (team.coach == null)
                throw new Exception("Team does not have a coach");

            team.coach = null;

            await context.SaveChangesAsync();

            return Ok($"Coach removed from team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("RemovePlayerFromTeam/{playerId}/{teamId}")]
    public async Task<ActionResult> RemovePlayerFromTeam(string playerId, string teamId)
    {
        try
        {
            var team = await context.Teams
                .Include(t => t.Players)
                .FirstOrDefaultAsync(t => t.Id.ToString() == teamId)
                ?? throw new Exception($"Team with Id {teamId} doesn't exist");

            var player = team.Players?
                .FirstOrDefault(p => p.Id.ToString() == playerId)
                ?? throw new Exception($"Player with Id {playerId} is not in the team");

            team.Players.Remove(player);

            await context.SaveChangesAsync();

            return Ok($"Player with Id {playerId} removed from team {teamId} successfully");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("upload-team-logo/{teamId}")]
    public async Task<IActionResult> UploadTeamLogo(Guid teamId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest("Invalid file type");

        var team = await context.Teams.FindAsync(teamId);
        if (team == null)
            return NotFound("Team not found");

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/teams");

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = $"{teamId}.webp";
        var filePath = Path.Combine(folderPath, fileName);

        using (var image = await Image.LoadAsync(file.OpenReadStream()))
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(300, 300),
                Mode = ResizeMode.Max
            }));

            await image.SaveAsync(filePath, new WebpEncoder
            {
                Quality = 75
            });
        }

        var relativePath = $"/images/teams/{fileName}";
        team.logoPathURL = relativePath;

        await context.SaveChangesAsync();

        return Ok(new { imageUrl = relativePath });
    }
}