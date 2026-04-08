using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class PointsServiceV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropColumn(
                name: "IsCaptain",
                table: "FantasyTeamPlayers");

            migrationBuilder.DropColumn(
                name: "IsInjured",
                table: "FantasyTeamPlayers");

            migrationBuilder.DropColumn(
                name: "IsStarter",
                table: "FantasyTeamPlayers");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyTeamId",
                table: "FantasyTeamRounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyPlayerFantasyTeamId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "PlayerGameStatsId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "FantasyPlayerRounds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "leagueAdminId",
                table: "FantasyLeagues",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "JoinCode",
                table: "FantasyLeagues",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyCoachFantasyTeamId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "CoachGameStatsId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "FantasyCoachRounds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "CoachImages",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Coach",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coach", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DraftSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeagueId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrentPickIndex = table.Column<int>(type: "int", nullable: false),
                    PickDeadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DraftSessions_FantasyLeagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "FantasyLeagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Team",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    coachId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    logoPathURL = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Team_Coach_coachId",
                        column: x => x.coachId,
                        principalTable: "Coach",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DraftPickOrder",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DraftSessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftPickOrder", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DraftPickOrder_DraftSessions_DraftSessionId",
                        column: x => x.DraftSessionId,
                        principalTable: "DraftSessions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DraftPickOrder_FantasyTeams_FantasyTeamId",
                        column: x => x.FantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Game",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HomeTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GuestTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Referee = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Round = table.Column<int>(type: "int", nullable: true),
                    HomeTeamScore = table.Column<int>(type: "int", nullable: false),
                    GuestTeamScore = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Game", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Game_Team_GuestTeamId",
                        column: x => x.GuestTeamId,
                        principalTable: "Team",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Game_Team_HomeTeamId",
                        column: x => x.HomeTeamId,
                        principalTable: "Team",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true),
                    JerseyNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Player_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CoachGameStats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GameId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CoachId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CoachTechnicalFouls = table.Column<int>(type: "int", nullable: true),
                    BenchTechnicalFouls = table.Column<int>(type: "int", nullable: true),
                    Difference = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoachGameStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoachGameStats_Coach_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Coach",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CoachGameStats_Game_GameId",
                        column: x => x.GameId,
                        principalTable: "Game",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PlayerGameStats",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GameId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: true),
                    Made1p = table.Column<int>(type: "int", nullable: true),
                    Miss1p = table.Column<int>(type: "int", nullable: true),
                    Made2p = table.Column<int>(type: "int", nullable: true),
                    Miss2p = table.Column<int>(type: "int", nullable: true),
                    Made3p = table.Column<int>(type: "int", nullable: true),
                    Miss3p = table.Column<int>(type: "int", nullable: true),
                    Assists = table.Column<int>(type: "int", nullable: true),
                    Rebounds = table.Column<int>(type: "int", nullable: true),
                    OffensiveRebounds = table.Column<int>(type: "int", nullable: true),
                    DefensiveRebounds = table.Column<int>(type: "int", nullable: true),
                    Steals = table.Column<int>(type: "int", nullable: true),
                    Turnovers = table.Column<int>(type: "int", nullable: true),
                    Pir = table.Column<int>(type: "int", nullable: true),
                    PersonalFouls = table.Column<int>(type: "int", nullable: true),
                    RecievedFouls = table.Column<int>(type: "int", nullable: true),
                    Blocks = table.Column<int>(type: "int", nullable: true),
                    RecievedBlocks = table.Column<int>(type: "int", nullable: true),
                    TechnicalFouls = table.Column<int>(type: "int", nullable: true),
                    SecondsPlayed = table.Column<int>(type: "int", nullable: true),
                    IsStarter = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerGameStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerGameStats_Game_GameId",
                        column: x => x.GameId,
                        principalTable: "Game",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerGameStats_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayerRounds_PlayerGameStatsId",
                table: "FantasyPlayerRounds",
                column: "PlayerGameStatsId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoachRounds_CoachGameStatsId",
                table: "FantasyCoachRounds",
                column: "CoachGameStatsId");

            migrationBuilder.CreateIndex(
                name: "IX_CoachGameStats_CoachId",
                table: "CoachGameStats",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_CoachGameStats_GameId",
                table: "CoachGameStats",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftPickOrder_DraftSessionId",
                table: "DraftPickOrder",
                column: "DraftSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftPickOrder_FantasyTeamId",
                table: "DraftPickOrder",
                column: "FantasyTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftSessions_LeagueId",
                table: "DraftSessions",
                column: "LeagueId");

            migrationBuilder.CreateIndex(
                name: "IX_Game_GuestTeamId",
                table: "Game",
                column: "GuestTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Game_HomeTeamId",
                table: "Game",
                column: "HomeTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Player_TeamId",
                table: "Player",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Player_Game_Unique",
                table: "PlayerGameStats",
                columns: new[] { "PlayerId", "GameId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerGameStats_GameId",
                table: "PlayerGameStats",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Team_coachId",
                table: "Team",
                column: "coachId");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoachRounds_CoachGameStats_CoachGameStatsId",
                table: "FantasyCoachRounds",
                column: "CoachGameStatsId",
                principalTable: "CoachGameStats",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                columns: new[] { "fantasyCoachFantasyTeamId", "fantasyCoachCoachId" },
                principalTable: "FantasyTeamCoaches",
                principalColumns: new[] { "FantasyTeamId", "CoachId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues",
                column: "leagueAdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                columns: new[] { "fantasyPlayerFantasyTeamId", "fantasyPlayerPlayerId" },
                principalTable: "FantasyTeamPlayers",
                principalColumns: new[] { "FantasyTeamId", "PlayerId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_PlayerGameStats_PlayerGameStatsId",
                table: "FantasyPlayerRounds",
                column: "PlayerGameStatsId",
                principalTable: "PlayerGameStats",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                table: "FantasyTeamRounds",
                column: "fantasyTeamId",
                principalTable: "FantasyTeams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoachRounds_CoachGameStats_CoachGameStatsId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_PlayerGameStats_PlayerGameStatsId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropTable(
                name: "CoachGameStats");

            migrationBuilder.DropTable(
                name: "DraftPickOrder");

            migrationBuilder.DropTable(
                name: "PlayerGameStats");

            migrationBuilder.DropTable(
                name: "DraftSessions");

            migrationBuilder.DropTable(
                name: "Game");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropTable(
                name: "Team");

            migrationBuilder.DropTable(
                name: "Coach");

            migrationBuilder.DropIndex(
                name: "IX_FantasyPlayerRounds_PlayerGameStatsId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyCoachRounds_CoachGameStatsId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropColumn(
                name: "PlayerGameStatsId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropColumn(
                name: "CoachGameStatsId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "FantasyCoachRounds");

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyTeamId",
                table: "FantasyTeamRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCaptain",
                table: "FantasyTeamPlayers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsInjured",
                table: "FantasyTeamPlayers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsStarter",
                table: "FantasyTeamPlayers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyPlayerFantasyTeamId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "leagueAdminId",
                table: "FantasyLeagues",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JoinCode",
                table: "FantasyLeagues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyCoachFantasyTeamId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "CoachImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                columns: new[] { "fantasyCoachFantasyTeamId", "fantasyCoachCoachId" },
                principalTable: "FantasyTeamCoaches",
                principalColumns: new[] { "FantasyTeamId", "CoachId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues",
                column: "leagueAdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                columns: new[] { "fantasyPlayerFantasyTeamId", "fantasyPlayerPlayerId" },
                principalTable: "FantasyTeamPlayers",
                principalColumns: new[] { "FantasyTeamId", "PlayerId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                table: "FantasyTeamRounds",
                column: "fantasyTeamId",
                principalTable: "FantasyTeams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
