using FantasyApi.Data;
using FantasyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ImageController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public ImageController(FantasyDbContext context)
    {
        this.context = context;
    }

    [HttpPost("UploadPlayerImage/{playerId}")]
    public async Task<IActionResult> UploadPlayerImage(Guid playerId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest("Invalid file type");

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/players");

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = $"{playerId}.webp";
        var filePath = Path.Combine(folderPath, fileName);

        using (var image = await Image.LoadAsync(file.OpenReadStream()))
        {
            image.Mutate(x =>
                x.Resize(new ResizeOptions { Size = new Size(300, 300), Mode = ResizeMode.Max })
            );

            await image.SaveAsync(filePath, new WebpEncoder { Quality = 75 });
        }

        var relativePath = $"/images/players/{fileName}";

        var existingImage = await context.PlayerImages.FirstOrDefaultAsync(x =>
            x.PlayerId == playerId
        );

        if (existingImage != null)
        {
            existingImage.ImageUrl = relativePath;
        }
        else
        {
            var playerImage = new PlayerImage
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                ImageUrl = relativePath,
            };

            await context.PlayerImages.AddAsync(playerImage);
        }

        await context.SaveChangesAsync();

        return Ok(new { imageUrl = relativePath });
    }

    [HttpPost("UploadCoachImage/{coachId}")]
    public async Task<IActionResult> UploadCoachImage(Guid coachId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest("Invalid file type");

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/coaches");

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = $"{coachId}.webp";
        var filePath = Path.Combine(folderPath, fileName);

        using (var image = await Image.LoadAsync(file.OpenReadStream()))
        {
            image.Mutate(x =>
                x.Resize(new ResizeOptions { Size = new Size(300, 300), Mode = ResizeMode.Max })
            );

            await image.SaveAsync(filePath, new WebpEncoder { Quality = 75 });
        }

        var relativePath = $"/images/coaches/{fileName}";

        var existingImage = await context.CoachImages.FirstOrDefaultAsync(x =>
            x.CoachId == coachId
        );

        if (existingImage != null)
        {
            existingImage.ImageUrl = relativePath;
        }
        else
        {
            var coachImage = new CoachImage
            {
                Id = Guid.NewGuid(),
                CoachId = coachId,
                ImageUrl = relativePath,
            };

            await context.CoachImages.AddAsync(coachImage);
        }

        await context.SaveChangesAsync();

        return Ok(new { imageUrl = relativePath });
    }
}
