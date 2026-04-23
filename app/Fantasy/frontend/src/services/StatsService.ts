import type { Coach } from "../models/Coach.modal";
import type { Player } from "../models/Player";
import type { Game } from "../models/Game";
import type { TeamStanding } from "../models/TeamStanding";
import apiClient from "./client";
import type { CoachStats } from "../models/CoachStats";
import type { PlayerStats } from "../models/PlayerStats";
import type { CoachView } from "../models/TeamLineUp";

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

export const getAllGamesForTeam = async (teamId: string) => {
  const response = await apiClient.get<Game[]>(
    `api/Stats/GetAllGamesForTeam/${teamId}`,
  );
  return response.data;
};

export const getCoachGameStats = async (coachId: string, gameId: string) => {
  const response = await apiClient.get<CoachStats>(
    `api/Stats/GetCoachGameStats/${coachId}/${gameId}`,
  );
  return response.data;
};

export const getPlayers = async () => {
  const response = await apiClient.get<Player[]>("api/Stats/GetAllPlayers");
  return response.data;
};

export const freePlayersInLeague = async (leagueId: string) => {
  const response = await apiClient.get<Player[]>(
    `FantasyTeam/GetAllFreePlayers/${leagueId}`,
  );
  return response.data;
};

export const getTeamAveragePlayerStats = async (teamId: string) => {
  const response = await apiClient.get<PlayerStats[]>(
    `api/Stats/GetTeamPlayerAverages/${teamId}`,
  );
  return response.data;
};

export const getAllFreeCoaches = async (leagueId: string) => {
  const response = await apiClient.get<CoachView[]>(
    `FantasyTeam/GetAllFreeCoaches/${leagueId}`,
  );
  return response.data;
};
