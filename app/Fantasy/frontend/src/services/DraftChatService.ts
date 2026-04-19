import apiClient from "./client";

export type DraftChatMessage = {
  Username: string;
  Message: string;
  Timestamp: string;
};


export const sendDraftChatMessage = async (
  leagueId: string,
  username: string,
  message: string
) => {
  const response = await apiClient.post("api/DraftChat/send", {
    leagueId,
    username,
    message,
  });
  return response.data;
};


export const getDraftChatStreamUrl = (leagueId: string) =>
  `https://localhost:7035/api/DraftChat/stream/${leagueId}`;