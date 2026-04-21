import type { Team } from "./Team";

export type Game = {
  id: string;
  homeTeam: Team;
  guestTeam: Team;
  dateTime: string;
  venue: string;
  homeTeamScore: number;
  guestTeamScore: number;
  round: number;
};