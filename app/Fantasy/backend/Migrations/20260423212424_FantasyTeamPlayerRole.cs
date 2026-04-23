using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FantasyTeamPlayerRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamPlayers_FantasyTeamRounds_FantasyTeamRoundId",
                table: "FantasyTeamPlayers");

            migrationBuilder.DropIndex(
                name: "IX_FantasyTeamPlayers_FantasyTeamRoundId",
                table: "FantasyTeamPlayers");

            migrationBuilder.DropColumn(
                name: "FantasyTeamRoundId",
                table: "FantasyTeamPlayers");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "FantasyTeamPlayers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "FantasyTeamRoundId",
                table: "FantasyPlayerRounds",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayerRounds_FantasyTeamRoundId",
                table: "FantasyPlayerRounds",
                column: "FantasyTeamRoundId");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamRounds_FantasyTeamRoundId",
                table: "FantasyPlayerRounds",
                column: "FantasyTeamRoundId",
                principalTable: "FantasyTeamRounds",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyTeamRounds_FantasyTeamRoundId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropIndex(
                name: "IX_FantasyPlayerRounds_FantasyTeamRoundId",
                table: "FantasyPlayerRounds");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "FantasyTeamPlayers");

            migrationBuilder.DropColumn(
                name: "FantasyTeamRoundId",
                table: "FantasyPlayerRounds");

            migrationBuilder.AddColumn<Guid>(
                name: "FantasyTeamRoundId",
                table: "FantasyTeamPlayers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamPlayers_FantasyTeamRoundId",
                table: "FantasyTeamPlayers",
                column: "FantasyTeamRoundId");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyTeamPlayers_FantasyTeamRounds_FantasyTeamRoundId",
                table: "FantasyTeamPlayers",
                column: "FantasyTeamRoundId",
                principalTable: "FantasyTeamRounds",
                principalColumn: "Id");
        }
    }
}
