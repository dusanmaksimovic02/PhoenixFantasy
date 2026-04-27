import type { CoachView, PlayerView, TeamLineup } from "../models/TeamLineUp";
import apiClient from "./client";

export const getDraftTeamStatus = async (fantasyTeamId: string) => {
  const response = await apiClient.get<TeamLineup>(
    `FantasyTeam/GetDraftTeamStatus/${fantasyTeamId}`,
  );
  return response.data;
};

export const getLineup = async (fantasyTeamId: string) => {
  const response = await apiClient.get<TeamLineup>(
    `FantasyTeam/GetLineup/${fantasyTeamId}`,
  );
  return response.data;
};

export const changCaptain = async (
  fantasyTeamId: string,
  newCaptainPlayerId: string,
) => {
  const response = await apiClient.post("FantasyTeam/ChangeCaptain", {
    fantasyTeamId,
    newCaptainPlayerId,
  });
  return response.data;
};

export const freePlayersInLeague = async (leagueId: string) => {
  const response = await apiClient.get<PlayerView[]>(
    `FantasyTeam/GetAllFreePlayers/${leagueId}`,
  );
  return response.data;
};

export const getAllFreePlayerSorted = async (leagueId: string) => {
  const response = await apiClient.get<PlayerView[]>(
    `FantasyTeam/GetAllFreePlayersSorted/${leagueId}`,
  );
  return response.data;
};

export const getAllFreeCoaches = async (leagueId: string) => {
  const response = await apiClient.get<CoachView[]>(
    `FantasyTeam/GetAllFreeCoaches/${leagueId}`,
  );
  return response.data;
};

export const tradePlayer = async (
  fantasyTeamId: string,
  oldPlayerId: string,
  newPlayerId: string,
  newPlayerPosition: string,
) => {
  console.log("Trade player data: ", {
    fantasyTeamId,
    oldPlayerId,
    newPlayerId,
    newPlayerPosition,
  });
  const response = await apiClient.post("FantasyTeam/TradePlayer", {
    fantasyTeamId,
    oldPlayerId,
    newPlayerId,
    newPlayerPosition,
  });
  return response.data;
};

export const tradeCoach = async (
  fantasyTeamId: string,
  oldCoachId: string,
  newCoachId: string,
) => {
  console.log("Trading coach with data: ", {
    fantasyTeamId,
    oldCoachId,
    newCoachId,
  });
  const response = await apiClient.post("FantasyTeam/TradeCoach", {
    fantasyTeamId,
    oldCoachId,
    newCoachId,
  });
  return response.data;
};

export const switchPlayer = async (
  fantasyTeamId: string,
  starterPlayerId: string,
  benchPlayerId: string,
) => {
  const response = await apiClient.post("FantasyTeam/SwitchPlayers", {
    fantasyTeamId,
    starterPlayerId,
    benchPlayerId,
  });
  return response.data;
};

export const getPointsForTeam = async (teamId: string) => {
  const response = await apiClient.get<{
    round: number;
    players: { playerId: string; roundPoints: number }[];
    coach: { coachId: string; roundPoints: number };
  }>(`FantasyTeam/GetPointsForTeam/${teamId}`);
  return response.data;
};

export const calculateTeamPoints = async (
  fantasyTeamId: string,
  round: number,
) => {
  const response = await apiClient.put(
    `FantasyRound/CalculateTeamPoints/${fantasyTeamId}/${round}`,
  );
  return response.data;
};

export const getFantasyTeamPoints = async (teamId: string, round: number) => {
  const response = await apiClient.get<{
    id: string;
    round: number;
    roundPoints: number;
  }>(`FantasyLeague/GetFantasyTeamPoints/${teamId}/${round}`);
  return response.data;
};
