import type { Player } from "../models/Player";
import type { Team } from "../models/Team";
import apiClient from "./client";

export const addTeam = async (team: Team, players: Player[]) => {
  const response = await apiClient.post("Team/AddTeam", { team, players });
  return response.data;
};
