import type { Coach } from "../models/Coach.modal";
import type { Player } from "../models/Player";
import type { TeamStanding } from "../models/TeamStanding";
import apiClient from "./client";

export const getStandings = async () => {
  const response = await apiClient.get<TeamStanding[]>(
    `api/Stats/GetStandings`,
  );
  return response.data;
};

export const getPlayersByTeam = async (teamId: string) => {
  const response = await apiClient.get<Player[]>(
    `api/Stats/GetPlayersByTeam/${teamId}`,
  );
  return response.data;
};

export const getCoachByTeam = async (teamId: string) => {
  const response = await apiClient.get<Coach>(
    `api/Stats/GetCoachByTeam/${teamId}`,
  );
  return response.data;
};

export const getPlayersByPosition = async (position: string) => {
  const response = await apiClient.get<Player[]>(
    "api/Stats/GetPlayersByPosition",
    {
      params: { position },
    },
  );
  return response.data;
};
