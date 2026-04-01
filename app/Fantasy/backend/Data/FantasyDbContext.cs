using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using FantasyApi.Models;

namespace FantasyApi.Data;

public class FantasyDbContext : IdentityDbContext<Person>
{
    //public DbSet<Person> Persons { get; set; }
    public DbSet<FantasyUser> FantasyUsers { get; set; }
    public DbSet<FantasyCoach> FantasyCoaches { get; set; }
    public DbSet<FantasyLeague> FantasyLeagues { get; set; }
    public DbSet<FantasyPlayer> FantasyPlayers { get; set; }
    public DbSet<FantasyTeam> FantasyTeams { get; set; }
    public DbSet<FantasyTeamRound> FantasyTeamRounds { get; set; }
    public DbSet<FantasyPlayerRound> FantasyPlayerRounds { get; set; }
    public DbSet<FantasyCoachRound> FantasyCoachRounds { get; set; }
    public DbSet<CoachImage> CoachImages { get; set; }
    public DbSet<PlayerImage> PlayerImages { get; set; }
    public FantasyDbContext(DbContextOptions<FantasyDbContext> options) : base(options)
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