using FantasyApi.Data;
using FantasyApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<StatsDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("StatsConnection")));

builder.Services.AddScoped<StatsService>();

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
