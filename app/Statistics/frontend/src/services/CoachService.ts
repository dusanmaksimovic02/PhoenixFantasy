import type { Coach } from "../models/Coach";
import apiClient from "./client";

export const addCoach = async (coach: Coach) => {
  const response = await apiClient.post("Coach/AddCoach", coach);
  return response.data;
};

export const getCoaches = async () => {
  const response = await apiClient.get<Coach[]>("Coach/GetCoaches");
  return response.data;
};

export const deleteCoach = async (id: string) => {
  const response = await apiClient.delete(`Coach/DeleteCoach/${id}`);
  return response.data;
};

export const updateCoach = async (coach: Coach) => {
  const response = await apiClient.put(`Coach/UpdateCoach/`, coach);
  return response.data;
};
