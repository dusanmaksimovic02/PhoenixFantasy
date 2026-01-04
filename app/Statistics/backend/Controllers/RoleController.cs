

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StatsApi.Data;

namespace StatsApi.Controllers;

[ApiController]
[Route("[controller]")]
public class RoleController : ControllerBase
{
    private DataContext context { get; set; }

    public RoleController(DataContext context)
    {
        this.context = context;
    }

    public static async Task SeedRoles(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles = { "Admin", "Moderator", "User" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

}