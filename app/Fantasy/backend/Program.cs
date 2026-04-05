using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FantasyApi.Data;
using FantasyApi.Models;
using FantasyApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
//using Microsoft.OpenApi.Models;
//using Microsoft.OpenApi.Models; // Proveri da li je ovo na vrhu, ako i dalje pravi grešku, obriši


var builder = WebApplication.CreateBuilder(args);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; // Dodaj i ovu liniju
})
.AddJwtBearer(options =>
{
    options.SaveToken = true; // OBAVEZNO: Ovo omogućava da token bude dostupan u context-u
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero // Eliminiše kašnjenje od 5 minuta
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context => 
        {
            // LOG 1: Proveravamo da li token uopšte stiže do middleware-a
            var authHeader = context.Request.Headers["Authorization"];
            Console.WriteLine($"[DEBUG] Stigao Authorization Header: {authHeader}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            // LOG 2: Ako ovo ispiše, claimovi MORAJU biti tu
            Console.WriteLine("[DEBUG] Token uspešno VALIDIRAN!");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            // LOG 3: Ako pukne, ovde će pisati zašto
            Console.WriteLine($"[DEBUG] Auth greška: {context.Exception.Message}");
            return Task.CompletedTask;
        }
    };
});


builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.MapOpenApi();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fantasy API v1");
        c.EnablePersistAuthorization(); 
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
