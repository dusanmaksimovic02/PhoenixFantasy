using Microsoft.EntityFrameworkCore;
using FantasyApi.Models;

namespace FantasyApi.Data;

public class StatsDbContext : DbContext
{
    public DbSet<Coach> Coaches { get; set; }
    public DbSet<CoachGameStats> CoachGameStats { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerGameStats> PlayerGameStats { get; set; }
    public DbSet<Team> Teams { get; set; }

    public StatsDbContext(DbContextOptions<StatsDbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.Ignore("Referee");
        });
    }

    public override int SaveChanges()
    {
        throw new InvalidOperationException("StatsDbContext je read-only!");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException("StatsDbContext je read-only!");
    }
}