using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using StatsApi.Models;

namespace StatsApi.Data;

public class DataContext : IdentityDbContext<Person>
{
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Coach> Coaches { get; set; }
    public DbSet<CoachGameStats> CoachGameStats { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<League> Leagues { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerGameStats> PlayerGameStats { get; set; }
    public DbSet<Statistician> Statisticians { get; set; }
    public DbSet<Team> Teams { get; set; }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
}

