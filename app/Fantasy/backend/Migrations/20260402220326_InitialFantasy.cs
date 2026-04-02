using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialFantasy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    dateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    TokenForgotPassword = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ForgotPasswordExp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CoachImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CoachId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoachImages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlayerImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerImages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FantasyLeagues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    leagueAdminId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyLeagues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                        column: x => x.leagueAdminId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FantasyCoaches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    coach = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyCoaches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FantasyCoachRounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fantasyCoachId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    roundPoints = table.Column<double>(type: "float", nullable: false),
                    round = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyCoachRounds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyCoachRounds_FantasyCoaches_fantasyCoachId",
                        column: x => x.fantasyCoachId,
                        principalTable: "FantasyCoaches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FantasyPlayerRounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fantasyPlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    roundPoints = table.Column<double>(type: "float", nullable: false),
                    round = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyPlayerRounds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FantasyPlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    player = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    isInjured = table.Column<bool>(type: "bit", nullable: false),
                    FantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamRoundId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FantasyTeamRoundId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyPlayers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FantasyTeams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeagueId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    fantasyPlayerCaptainId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    FantasyLeagueId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyTeams_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyTeams_FantasyLeagues_FantasyLeagueId",
                        column: x => x.FantasyLeagueId,
                        principalTable: "FantasyLeagues",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyTeams_FantasyPlayers_fantasyPlayerCaptainId",
                        column: x => x.fantasyPlayerCaptainId,
                        principalTable: "FantasyPlayers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FantasyTeamRounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fantasyTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    fantasyPlayerCaptainId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    fantasyCoachId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    round = table.Column<int>(type: "int", nullable: false),
                    roundPoints = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FantasyTeamRounds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FantasyTeamRounds_FantasyCoaches_fantasyCoachId",
                        column: x => x.fantasyCoachId,
                        principalTable: "FantasyCoaches",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyTeamRounds_FantasyPlayers_fantasyPlayerCaptainId",
                        column: x => x.fantasyPlayerCaptainId,
                        principalTable: "FantasyPlayers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                        column: x => x.fantasyTeamId,
                        principalTable: "FantasyTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoaches_FantasyTeamId",
                table: "FantasyCoaches",
                column: "FantasyTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyCoachRounds_fantasyCoachId",
                table: "FantasyCoachRounds",
                column: "fantasyCoachId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyLeagues_leagueAdminId",
                table: "FantasyLeagues",
                column: "leagueAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyPlayerRounds_fantasyPlayerId",
                table: "FantasyPlayerRounds",
                column: "fantasyPlayerId");

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

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_fantasyCoachId",
                table: "FantasyTeamRounds",
                column: "fantasyCoachId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds",
                column: "fantasyPlayerCaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeamRounds_fantasyTeamId",
                table: "FantasyTeamRounds",
                column: "fantasyTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeams_FantasyLeagueId",
                table: "FantasyTeams",
                column: "FantasyLeagueId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeams_fantasyPlayerCaptainId",
                table: "FantasyTeams",
                column: "fantasyPlayerCaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_FantasyTeams_UserId",
                table: "FantasyTeams",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyCoaches_FantasyTeams_FantasyTeamId",
                table: "FantasyCoaches",
                column: "FantasyTeamId",
                principalTable: "FantasyTeams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayerRounds_FantasyPlayers_fantasyPlayerId",
                table: "FantasyPlayerRounds",
                column: "fantasyPlayerId",
                principalTable: "FantasyPlayers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayers_FantasyTeamRounds_FantasyTeamRoundId",
                table: "FantasyPlayers",
                column: "FantasyTeamRoundId",
                principalTable: "FantasyTeamRounds",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayers_FantasyTeamRounds_FantasyTeamRoundId1",
                table: "FantasyPlayers",
                column: "FantasyTeamRoundId1",
                principalTable: "FantasyTeamRounds",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId",
                table: "FantasyPlayers",
                column: "FantasyTeamId",
                principalTable: "FantasyTeams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId1",
                table: "FantasyPlayers",
                column: "FantasyTeamId1",
                principalTable: "FantasyTeams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FantasyLeagues_AspNetUsers_leagueAdminId",
                table: "FantasyLeagues");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeams_AspNetUsers_UserId",
                table: "FantasyTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyCoaches_FantasyTeams_FantasyTeamId",
                table: "FantasyCoaches");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId",
                table: "FantasyPlayers");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyPlayers_FantasyTeams_FantasyTeamId1",
                table: "FantasyPlayers");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyTeams_fantasyTeamId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyCoaches_fantasyCoachId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropForeignKey(
                name: "FK_FantasyTeamRounds_FantasyPlayers_fantasyPlayerCaptainId",
                table: "FantasyTeamRounds");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CoachImages");

            migrationBuilder.DropTable(
                name: "FantasyCoachRounds");

            migrationBuilder.DropTable(
                name: "FantasyPlayerRounds");

            migrationBuilder.DropTable(
                name: "PlayerImages");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "FantasyTeams");

            migrationBuilder.DropTable(
                name: "FantasyLeagues");

            migrationBuilder.DropTable(
                name: "FantasyCoaches");

            migrationBuilder.DropTable(
                name: "FantasyPlayers");

            migrationBuilder.DropTable(
                name: "FantasyTeamRounds");
        }
    }
}
