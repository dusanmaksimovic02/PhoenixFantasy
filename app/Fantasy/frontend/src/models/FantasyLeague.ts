import type { User } from "./User";

export type FantasyLeague = {
  id: string;
  leagueAdmin: User;
  leagueAdminId: string;
  fantasyTeams: string[];
  leagueName: string;
  joinCode: string;
  teamName: string;
  teamId: string;
  isDraftStarted: boolean;
};
