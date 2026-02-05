

using Microsoft.AspNetCore.Mvc;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PlayerGameStatsController : ControllerBase
{
    private readonly PlayerStatService _playerStatService;

    public PlayerGameStatsController(PlayerStatService playerStatService)
    {
        _playerStatService = playerStatService;
    }

    [HttpPost("UpdateStats")]
    public async Task<IActionResult> UpdateStats([FromBody] UpdatePlayerStatDto dto)
    {
        try
        {
            await _playerStatService.UpdateStatAsync(dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


}

