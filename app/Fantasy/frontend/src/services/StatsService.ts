import type { TeamStanding } from "../models/TeamStanding";
import apiClient from "./client";

export const getStandings = async () => {
    const response = await apiClient.get<TeamStanding[]>(
    `api/Stats/GetStandings`,
  );
  return response.data;
}