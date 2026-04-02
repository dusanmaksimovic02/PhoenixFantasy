using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FantasyApi.Data;
using FantasyApi.Models;
using FantasyApi.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<StatsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("StatsConnection")));
builder.Services.AddDbContext<FantasyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FantasyConnection")));

builder.Services.AddScoped<StatsService>();

builder.Services.AddIdentity<Person, IdentityRole>()
    .AddEntityFrameworkStores<FantasyDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options=>{
        {
            options.SwaggerEndpoint("/openapi/v1.json", "OpenAPI v1");
        }
    });
}

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = { "Admin", "Manager", "User" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
