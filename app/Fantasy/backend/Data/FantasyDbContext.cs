using FantasyApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace FantasyApi.Data;

public class FantasyDbContext : IdentityDbContext<Person>
{
    public DbSet<Person> Persons { get; set; }

    //public DbSet<FantasyUser> FantasyUsers { get; set; }
    public DbSet<FantasyTeamCoach> FantasyTeamCoaches { get; set; }
    public DbSet<FantasyLeague> FantasyLeagues { get; set; }
    public DbSet<FantasyTeamPlayer> FantasyTeamPlayers { get; set; }
    public DbSet<FantasyTeam> FantasyTeams { get; set; }
    public DbSet<FantasyTeamRound> FantasyTeamRounds { get; set; }
    public DbSet<FantasyPlayerRound> FantasyPlayerRounds { get; set; }
    public DbSet<FantasyCoachRound> FantasyCoachRounds { get; set; }
    public DbSet<CoachImage> CoachImages { get; set; }
    public DbSet<PlayerImage> PlayerImages { get; set; }
    public DbSet<DraftSession> DraftSessions { get; set; }
    public DbSet<DraftPickOrder> DraftPickOrder { get; set; }

    public FantasyDbContext(DbContextOptions<FantasyDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityPasskeyData>(entity =>
        {
            entity.HasNoKey();
            entity.ToView(null);
        });

        //player
        modelBuilder.Entity<FantasyTeamPlayer>().HasKey(x => new { x.FantasyTeamId, x.PlayerId });

        modelBuilder
            .Entity<FantasyTeamPlayer>()
            .HasOne(x => x.FantasyTeam)
            .WithMany(t => t.Players)
            .HasForeignKey(x => x.FantasyTeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FantasyTeamPlayer>().HasIndex(x => x.PlayerId);

        //coach
        modelBuilder.Entity<FantasyTeamCoach>().HasKey(x => new { x.FantasyTeamId, x.CoachId });

        modelBuilder
            .Entity<FantasyTeamCoach>()
            .HasOne(x => x.FantasyTeam)
            .WithMany(t => t.Coach)
            .HasForeignKey(x => x.FantasyTeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FantasyTeamCoach>().HasIndex(x => x.CoachId);
    }
}
