import type { TeamLineup } from "../models/TeamLineUp";
import apiClient from "./client";

export const getLineup = async (fantasyTeamId: string) => {
  const response = await apiClient.get<TeamLineup>(
    `FantasyTeam/GetDraftTeamStatus/${fantasyTeamId}`,
  );
  return response.data;
};
