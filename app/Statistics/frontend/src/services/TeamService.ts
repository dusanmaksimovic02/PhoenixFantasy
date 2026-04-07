import type { Coach } from "@/models/Coach";
import type { Player } from "../models/Player";
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

export const deleteTeam = async (id: string) => {
  const response = await apiClient.delete(`Team/DeleteTeam/${id}`);
  return response.data;
};

export const removeCoachFromTeam = async (teamId: string) => {
  const response = await apiClient.put(`Team/RemoveCoachFromTeam/${teamId}`);
  return response.data;
};

export const uploadTeamLogo = async (teamId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    `Team/upload-team-logo/${teamId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getTeamPlayers = async (teamId: string) => {
  const response = await apiClient.get<Player[]>(
    `Team/GetTeamPlayers/${teamId}`,
  );
  return response.data;
};

export const getTeamCoach = async (teamId: string) => {
  const response = await apiClient.get<Coach>(`Team/GetTeamCoach/${teamId}`);
  return response.data;
};
