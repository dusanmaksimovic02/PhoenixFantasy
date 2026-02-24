import type { Player } from "../models/Player";
import apiClient from "./client";

export const addPlayer = async (player: Player) => {
  const response = await apiClient.post("Player/AddPlayer", player);
  return response.data;
};

export const getPlayers = async () => {
  const response = await apiClient.get<Player[]>("Player/GetPlayers");
  return response.data;
};

export const deletePlayer = async (id: string) => {
  const response = await apiClient.delete(`Player/DeletePlayer/${id}`);
  return response.data;
};

export const updatePlayer = async (player: Player) => {
  const response = await apiClient.put(`Player/UpdatePlayer/`, player);
  return response.data;
};
