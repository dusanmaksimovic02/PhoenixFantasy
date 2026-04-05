using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class IndexPlayerGameStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerGameStats_Games_GameId",
                table: "PlayerGameStats");

            migrationBuilder.DropForeignKey(
                name: "FK_PlayerGameStats_Players_PlayerId",
                table: "PlayerGameStats");

            migrationBuilder.DropIndex(
                name: "IX_PlayerGameStats_PlayerId",
                table: "PlayerGameStats");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlayerId",
                table: "PlayerGameStats",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "GameId",
                table: "PlayerGameStats",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Player_Game_Unique",
                table: "PlayerGameStats",
                columns: new[] { "PlayerId", "GameId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerGameStats_Games_GameId",
                table: "PlayerGameStats",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerGameStats_Players_PlayerId",
                table: "PlayerGameStats",
                column: "PlayerId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerGameStats_Games_GameId",
                table: "PlayerGameStats");

            migrationBuilder.DropForeignKey(
                name: "FK_PlayerGameStats_Players_PlayerId",
                table: "PlayerGameStats");

            migrationBuilder.DropIndex(
                name: "IX_Player_Game_Unique",
                table: "PlayerGameStats");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlayerId",
                table: "PlayerGameStats",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "GameId",
                table: "PlayerGameStats",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerGameStats_PlayerId",
                table: "PlayerGameStats",
                column: "PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerGameStats_Games_GameId",
                table: "PlayerGameStats",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerGameStats_Players_PlayerId",
                table: "PlayerGameStats",
                column: "PlayerId",
                principalTable: "Players",
                principalColumn: "Id");
        }
    }
}
