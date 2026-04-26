import apiClient from "./client";

export const startRound = async () => {
  const response = await apiClient.post("Manager/StartRound");
  return response.data;
};

export const endRound = async () => {
  const response = await apiClient.post("Manager/EndRound");
  return response.data;
};
