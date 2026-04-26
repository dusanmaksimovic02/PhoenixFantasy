import type { FantasyLeague } from "../models/FantasyLeague";
import type { FantasyLeagueStanding } from "../models/FantasyLeagueStanding";
import apiClient from "./client";

export const getFantasyLeagueStandings = async (leagueId: string) => {
  const response = await apiClient.get<FantasyLeagueStanding[]>(
    `FantasyLeague/getFantasyLeagueStandings/${leagueId}`,
  );
  return response.data;
};

export const getFantasyLeague = async (leagueId: string) => {
  const response = await apiClient.get<FantasyLeague>(
    `FantasyLeague/GetFantasyLeague/${leagueId}`,
  );
  return response.data;
};

export const getCurrentRound = async () => {
  const response = await apiClient.get<FantasyLeague>(
    "FantasyLeague/GetCurrentRound",
  );
  return response.data;
};
