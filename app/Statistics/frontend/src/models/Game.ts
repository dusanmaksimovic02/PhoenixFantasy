import type { Team } from "./Team";
import type { User } from "./User";

export type Game = {
  id: string;
  homeTeam: Team;
  guestTeam: Team;
  referee: User;
  dateTime: string;
  venue: string;
  homeTeamScore: number;
  guestTeamScore: number;
  round: number;
};
