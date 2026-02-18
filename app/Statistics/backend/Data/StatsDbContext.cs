using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using StatsApi.Models;

namespace StatsApi.Data;

public class DataContext : IdentityDbContext<Person>
{
    public DbSet<Person> Persons { get; set; }
    //public DbSet<Admin> Admins { get; set; }
    public DbSet<Coach> Coaches { get; set; }
    public DbSet<CoachGameStats> CoachGameStats { get; set; }
    public DbSet<Game> Games { get; set; }
    //public DbSet<Manager> Managers { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerGameStats> PlayerGameStats { get; set; }
    //public DbSet<Referee> Referees { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityPasskeyData>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null); //ne treba tabela
        });
    }
}

