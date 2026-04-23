import axios from "axios";
import apiClient from "./client";
import { toast } from "react-toastify";
import { type User } from "../models/User";
import type { FantasyLeague } from "@/models/FantasyLeague";

export const createLeagueWithTeam = async (
  userId: string,
  leagueName: string,
  teamName: string,
) => {
  try {
    const response = await apiClient.post(
      "FantasyLeague/CreateLeagueWithTeam",
      {
        userId,
        leagueName,
        teamName,
      },
    );

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const message = e.response.data?.message || "Create Draft League failed";
      toast.error(message);
      console.log("Create Draft League ERROR:", message);
    } else {
      toast.error("Create Draft League failed! Please try again later.");
      console.log(e);
    }
    throw e;
  }
};

export const getFantasyLeagueParticipant = async (leagueId: string) => {
  const response = await apiClient.get<User[]>(
    `FantasyLeague/GetFantasyLeagueParticipant/${leagueId}`,
  );

  return response.data;
};

export const joinToLeague = async (
  userId: string,
  joinCode: string,
  teamName: string,
) => {
  try {
    const response = await apiClient.post("FantasyLeague/JoinLeague", {
      userId,
      joinCode,
      teamName,
    });

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const message = e.response.data || "Join League failed";
      toast.error(message);
      console.log("Join League ERROR:", message);
    } else {
      toast.error("Join League failed! Please try again later.");
      console.log(e);
    }
    throw e;
  }
};

export const getLeagueAdmin = async (leagueId: string) => {
  const response = await apiClient.get(
    `FantasyLeague/GetFantasyLeagueAdmin/${leagueId}`,
  );

  return response.data;
};

export const removeParticipantFromTeam = async (
  userId: string,
  leagueId: string,
) => {
  const response = await apiClient.delete(
    "FantasyLeague/RemovePlayerFromLeague",
    {
      data: {
        userId,
        leagueId,
      },
    },
  );

  return response.data;
};

export const isDraftStarted = async (leagueId: string) => {
  const response = await apiClient.get<boolean>(
    `FantasyLeague/IsDraftStarted/${leagueId}`,
  );
  return response.data;
};

export const getFantasyLeaguesFroUser = async (userId: string) => {
  const response = await apiClient.get<FantasyLeague[]>(
    `FantasyLeague/GetFantasyLeaguesForUser/${userId}`,
  );
  return response.data;
};

export const deleteLeague = async (leagueId: String) => {
  const response = await apiClient.delete(
    `FantasyLeague/DeleteLeague/${leagueId}`,
  );
  return response.data;
};

export const startDraft = async (leagueId: string) => {
  const response = await apiClient.post("Draft/StartDraft", {
    leagueId,
  });
  return response.data;
};

export const getDraftSessionId = async (leagueId: string) => {
  const response = await apiClient.get<string>(
    `Draft/GetDraftSessionId/${leagueId}`,
  );
  return response.data;
};

export const pickPlayer = async (
  draftId: string,
  fantasyTeamId: string,
  playerId: string,
) => {
  try {
    const response = await apiClient.post("Draft/PickPlayer", {
      draftId,
      fantasyTeamId,
      playerId,
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const message = e.response.data?.message || "Adding player failed";
      toast.error(message);
      console.log("Adding player ERROR:", e);
    } else {
      toast.error("Adding player failed! Please try again later.");
      console.log(e);
    }
    throw e;
  }
};

export const pickCoach = async (
  draftId: string,
  fantasyTeamId: string,
  coachId: string,
) => {
  try {
    const response = await apiClient.post("Draft/PickCoach", {
      draftId,
      fantasyTeamId,
      coachId,
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const message = e.response.data?.message || "Adding coach failed";
      toast.error(message);
      console.log("Adding coach ERROR:", e);
    } else {
      toast.error("Adding coach failed! Please try again later.");
      console.log(e);
    }
    throw e;
  }
};

export const getDraftSession = async (draftId: string) => {
  const response = await apiClient.get(`Draft/GetDraftStatus/${draftId}`);
  return response.data;
};
