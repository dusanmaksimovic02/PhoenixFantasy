import type { Game } from "@/models/Game";
import apiClient from "./client";

export const addGame = async (
  homeTeamId: string,
  awayTeamId: string,
  dateTime: string,
  venue: string,
  refereeId: string,
) => {
  const response = await apiClient.post("/Game/AddGame", {
    homeTeamId,
    guestTeamId: awayTeamId,
    dateTime,
    venue,
    refereeId,
  });
  return response.data;
};

export const getGames = async () => {
  const response = await apiClient.get("/Game/GetGames");
  return response.data;
};

export const updateGame = async (game: Game) => {
  const response = await apiClient.put("/Game/UpdateGame", {
    id: game.id,
    homeTeamId: game.homeTeam.id,
    guestTeamId: game.guestTeam.id,
    dateTime: game.dateTime,
    venue: game.venue,
    refereeId: game.referee.id,
  });
  return response.data;
};

export const deleteGame = async (id: string) => {
  const response = await apiClient.delete(`/Game/DeleteGame/${id}`);
  return response.data;
};

export const getGameById = async (id: string) => {
  const response = await apiClient.get(`/Game/GetGameById/${id}`);
  return response.data;
};
