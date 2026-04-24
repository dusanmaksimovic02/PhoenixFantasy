import type { FantasyLeagueStanding } from "../models/FantasyLeagueStanding";
import apiClient from "./client";

export const getFantasyLeagueStandings = async (leagueId: string) => {
  const response = await apiClient.get<FantasyLeagueStanding[]>(
    `FantasyLeague/getFantasyLeagueStandings/${leagueId}`,
  );
  return response.data;
};
