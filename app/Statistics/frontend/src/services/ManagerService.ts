import apiClient from "./client";
import type { User } from "../models/User";

export const getMangers = async () => {
  const response = await apiClient.get<User[]>("Manager/GetManagers");
  return response.data;
};

export const deleteManager = async (id: string) => {
  const response = await apiClient.delete(`Manager/DeleteManager/${id}`);
  return response.data;
};
