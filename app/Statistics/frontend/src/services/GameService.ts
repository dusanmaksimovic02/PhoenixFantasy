import type { Game } from "@/models/Game";
import apiClient from "./client";

export const addGame = async (
  homeTeamId: string,
  awayTeamId: string,
  dateTime: string,
  venue: string,
  refereeId: string,
  round: number,
) => {
  const response = await apiClient.post("/Game/AddGame", {
    homeTeamId,
    guestTeamId: awayTeamId,
    dateTime,
    venue,
    refereeId,
    round,
  });
  return response.data;
};

export const getGames = async () => {
  const response = await apiClient.get("/Game/GetGames");
  return response.data;
};

export const updateGame = async (game: {
  gameId: string;
  homeTeamId: string;
  guestTeamId: string;
  dateTime: string;
  venue: string;
  refereeId: string;
  round: number;
}) => {
  const response = await apiClient.put("Game/UpdateGame", game);
  return response.data;
};

export const deleteGame = async (id: string) => {
  const response = await apiClient.delete(`/Game/DeleteGame/${id}`);
  return response.data;
};

export const getGameById = async (id: string) => {
  const response = await apiClient.get<Game>(`/Game/GetGameById/${id}`);
  return response.data;
};
