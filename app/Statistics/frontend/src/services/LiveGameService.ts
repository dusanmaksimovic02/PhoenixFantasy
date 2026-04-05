import type { Player } from "@/models/Player";
import apiClient from "./client";
import type { PlayerGameStats } from "@/models/PlayerGameStats";

export const startGame = async (
  gameId: string,
  homeTeamPlayerIds: string[],
  homeStartersIds: string[],
  guestTeamPlayerIds: string[],
  guestStartersIds: string[],
) => {
  const response = await apiClient.post("/Game/StartGame", {
    gameId,
    homeTeamPlayerIds,
    homeStartersIds,
    guestTeamPlayerIds,
    guestStartersIds,
  });
  return response.data;
};

export const updateStats = async (
  gameId: string,
  playerId: string,
  changes: { statType: number; delta: number }[],
) => {

  const response = await apiClient.post("PlayerGameStats/UpdateStats", {
    gameId,
    playerId,
    changes,
  });
  return response.data;
};

export const updateStarter = async (
  gameId: string,
  prevStarter: string,
  newStarter: string,
) => {
  const response = await apiClient.put(
    `PlayerGameStats/ChangeStarter/${gameId}/${prevStarter}/${newStarter}`,
    {},
  );
  return response.data;
};

export const getTeamStartersFromGame = async (
  teamId: string,
  gameId: string,
) => {
  const response = await apiClient.get<Player[]>(
    `PlayerGameStats/GetTeamStartersFromGame/${teamId}/${gameId}`,
    {},
  );
  return response.data;
};

export const getTeamNonStartersFromGame = async (
  teamId: string,
  gameId: string,
) => {
  const response = await apiClient.get<Player[]>(
    `PlayerGameStats/GetTeamNonStartersFromGame/${teamId}/${gameId}`,
    {},
  );
  return response.data;
};

export const getTeamPlayersFromGame = async (
  teamId: string,
  gameId: string,
) => {
  const response = await apiClient.get<PlayerGameStats[]>(
    `PlayerGameStats/GetTeamPlayersFromGame/${teamId}/${gameId}`,
    {},
  );
  return response.data;
};

export const getPlayerStatsFromGame = async (
  playerId: string,
  gameId: string,
) => {
  const response = await apiClient.get<PlayerGameStats>(
    `PlayerGameStats/GetPlayerStatsFromGame/${playerId}/${gameId}`,
  );
  return response.data;
};
