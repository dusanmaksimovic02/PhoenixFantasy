import type { Team } from "../models/Team";
import apiClient from "./client";

export const addTeam = async (
  name: string,
  coach: string,
  players: string[],
) => {
  const response = await apiClient.post("Team/AddTeam", {
    name: name,
    coachId: coach,
    playerIds: players,
  });
  return response.data;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await apiClient.get("Team/GetTeams");
  return response.data;
};

export const updateTeamCoach = async (teamId: string, coachId: string) => {
  const response = await apiClient.put(`Team/UpdateCoach/${coachId}/${teamId}`);
  return response.data;
};

export const removePlayerFromTeam = async (
  teamId: string,
  playerId: string,
) => {
  const response = await apiClient.put(
    `Team/RemovePlayerFromTeam/${playerId}/${teamId}`,
  );
  return response.data;
};

export const addPlayersToTeam = async (teamId: string, playerIds: string[]) => {
  const response = await apiClient.put(
    `Team/AddPlayersToTeam/${teamId}`,
    playerIds,
  );
  return response.data;
};
