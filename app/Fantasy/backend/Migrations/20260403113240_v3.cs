using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues");

            migrationBuilder.AlterColumn<string>(
                name: "leagueAdminId",
                table: "FantasyLeagues",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JoinCode",
                table: "FantasyLeagues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LeagueName",
                table: "FantasyLeagues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues",
                column: "leagueAdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues");

            migrationBuilder.DropColumn(
                name: "JoinCode",
                table: "FantasyLeagues");

            migrationBuilder.DropColumn(
                name: "LeagueName",
                table: "FantasyLeagues");

            migrationBuilder.AlterColumn<string>(
                name: "leagueAdminId",
                table: "FantasyLeagues",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues",
                column: "leagueAdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
