using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoachRounds_FantasyCoaches_fantasyCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyPlayers_fantasyPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyCoaches_fantasyCoachId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyPlayers_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeams_FantasyPlayers_fantasyPlayerCaptainId",
                table: "FantasyTeams");

            migrationBuilder.DropTable(
                name: "FantasyCoaches");

            migrationBuilder.DropTable(
                name: "FantasyPlayers");

            migrationBuilder.DropIndex(
                name: "IX_FantasyTeams_fantasyPlayerCaptainId",
                table: "FantasyTeams");

            migrationBuilder.DropIndex(
                name: "IX_FantasyTeamRounds_fantasyCoachId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyTeamRounds_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyPlayerRounds_fantasyPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyCoachRounds_fantasyCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropColumn(
                name: "fantasyPlayerCaptainId",
                table: "FantasyTeams");

            migrationBuilder.RenameColumn(
                name: "fantasyPlayerCaptainId",
                table: "FantasyTeamRounds",
                newName: "CoachId");

            migrationBuilder.RenameColumn(
                name: "fantasyCoachId",
                table: "FantasyTeamRounds",
                newName: "CoachFantasyTeamId");

            migrationBuilder.RenameColumn(
                name: "fantasyPlayerId",
                table: "FantasyPlayerRounds",
                newName: "fantasyPlayerPlayerId");

            migrationBuilder.RenameColumn(
                name: "fantasyCoachId",
                table: "FantasyCoachRounds",
                newName: "fantasyCoachFantasyTeamId");

            migrationBuilder.AddColumn<Guid>(
                name: "fantasyPlayerFantasyTeamId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "FantasyTeamCoaches",
                columns: table => new
                {
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CoachId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyTeamCoaches", x => new { x.FantasyTeamId, x.CoachId });
                    table.ForeignKey(
                        name: "FK_FantasyTeamCoaches_FantasyTeams_FantasyTeamId",
                        column: x => x.FantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FantasyTeamPlayers",
                columns: table => new
                {
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsStarter = table.Column<bool>(type: "bit", nullable: false),
                    IsCaptain = table.Column<bool>(type: "bit", nullable: false),
                    IsInjured = table.Column<bool>(type: "bit", nullable: false),
                    FantasyTeamRoundId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyTeamPlayers", x => new { x.FantasyTeamId, x.PlayerId });
                    table.ForeignKey(
                        name: "FK_FantasyTeamPlayers_FantasyTeamRounds_FantasyTeamRoundId",
                        column: x => x.FantasyTeamRoundId,
                        principalTable: "FantasyTeamRounds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyTeamPlayers_FantasyTeams_FantasyTeamId",
                        column: x => x.FantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_CoachFantasyTeamId_CoachId",
                table: "FantasyTeamRounds",
                columns: new[] { "CoachFantasyTeamId", "CoachId" });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayerRounds_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                columns: new[] { "fantasyPlayerFantasyTeamId", "fantasyPlayerPlayerId" });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoachRounds_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                columns: new[] { "fantasyCoachFantasyTeamId", "fantasyCoachCoachId" });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamCoaches_CoachId",
                table: "FantasyTeamCoaches",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamPlayers_FantasyTeamRoundId",
                table: "FantasyTeamPlayers",
                column: "FantasyTeamRoundId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamPlayers_PlayerId",
                table: "FantasyTeamPlayers",
                column: "PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds",
                columns: new[] { "fantasyCoachFantasyTeamId", "fantasyCoachCoachId" },
                principalTable: "FantasyTeamCoaches",
                principalColumns: new[] { "FantasyTeamId", "CoachId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                columns: new[] { "fantasyPlayerFantasyTeamId", "fantasyPlayerPlayerId" },
                principalTable: "FantasyTeamPlayers",
                principalColumns: new[] { "FantasyTeamId", "PlayerId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeamCoaches_CoachFantasyTeamId_CoachId",
                table: "FantasyTeamRounds",
                columns: new[] { "CoachFantasyTeamId", "CoachId" },
                principalTable: "FantasyTeamCoaches",
                principalColumns: new[] { "FantasyTeamId", "CoachId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoachRounds_FantasyTeamCoaches_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamPlayers_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeamCoaches_CoachFantasyTeamId_CoachId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropTable(
                name: "FantasyTeamCoaches");

            migrationBuilder.DropTable(
                name: "FantasyTeamPlayers");

            migrationBuilder.DropIndex(
                name: "IX_FantasyTeamRounds_CoachFantasyTeamId_CoachId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyPlayerRounds_fantasyPlayerFantasyTeamId_fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyCoachRounds_fantasyCoachFantasyTeamId_fantasyCoachCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.DropColumn(
                name: "fantasyPlayerFantasyTeamId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropColumn(
                name: "fantasyCoachCoachId",
                table: "FantasyCoachRounds");

            migrationBuilder.RenameColumn(
                name: "CoachId",
                table: "FantasyTeamRounds",
                newName: "fantasyPlayerCaptainId");

            migrationBuilder.RenameColumn(
                name: "CoachFantasyTeamId",
                table: "FantasyTeamRounds",
                newName: "fantasyCoachId");

            migrationBuilder.RenameColumn(
                name: "fantasyPlayerPlayerId",
                table: "FantasyPlayerRounds",
                newName: "fantasyPlayerId");

            migrationBuilder.RenameColumn(
                name: "fantasyCoachFantasyTeamId",
                table: "FantasyCoachRounds",
                newName: "fantasyCoachId");

            migrationBuilder.AddColumn<Guid>(
                name: "fantasyPlayerCaptainId",
                table: "FantasyTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FantasyCoaches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    coach = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyCoaches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyCoaches_FantasyTeams_FantasyTeamId",
                        column: x => x.FantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FantasyPlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamRoundId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamRoundId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    isInjured = table.Column<bool>(type: "bit", nullable: false),
                    player = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyPlayers_FantasyTeamRounds_FantasyTeamRoundId",
                        column: x => x.FantasyTeamRoundId,
                        principalTable: "FantasyTeamRounds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyPlayers_FantasyTeamRounds_FantasyTeamRoundId1",
                        column: x => x.FantasyTeamRoundId1,
                        principalTable: "FantasyTeamRounds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId",
                        column: x => x.FantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId1",
                        column: x => x.FantasyTeamId1,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeams_fantasyPlayerCaptainId",
                table: "FantasyTeams",
                column: "fantasyPlayerCaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_fantasyCoachId",
                table: "FantasyTeamRounds",
                column: "fantasyCoachId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds",
                column: "fantasyPlayerCaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayerRounds_fantasyPlayerId",
                table: "FantasyPlayerRounds",
                column: "fantasyPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoachRounds_fantasyCoachId",
                table: "FantasyCoachRounds",
                column: "fantasyCoachId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoaches_FantasyTeamId",
                table: "FantasyCoaches",
                column: "FantasyTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayers_FantasyTeamId",
                table: "FantasyPlayers",
                column: "FantasyTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayers_FantasyTeamId1",
                table: "FantasyPlayers",
                column: "FantasyTeamId1");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayers_FantasyTeamRoundId",
                table: "FantasyPlayers",
                column: "FantasyTeamRoundId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayers_FantasyTeamRoundId1",
                table: "FantasyPlayers",
                column: "FantasyTeamRoundId1");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoachRounds_FantasyCoaches_fantasyCoachId",
                table: "FantasyCoachRounds",
                column: "fantasyCoachId",
                principalTable: "FantasyCoaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyPlayers_fantasyPlayerId",
                table: "FantasyPlayerRounds",
                column: "fantasyPlayerId",
                principalTable: "FantasyPlayers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamRounds_FantasyCoaches_fantasyCoachId",
                table: "FantasyTeamRounds",
                column: "fantasyCoachId",
                principalTable: "FantasyCoaches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamRounds_FantasyPlayers_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds",
                column: "fantasyPlayerCaptainId",
                principalTable: "FantasyPlayers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeams_FantasyPlayers_fantasyPlayerCaptainId",
                table: "FantasyTeams",
                column: "fantasyPlayerCaptainId",
                principalTable: "FantasyPlayers",
                principalColumn: "Id");
        }
    }
}
