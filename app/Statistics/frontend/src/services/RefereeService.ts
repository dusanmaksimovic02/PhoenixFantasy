import type { User } from "../models/User";
import apiClient from "./client";

export const getReferees = async () => {
  const response = await apiClient.get<User[]>("Referee/GetReferees");
  return response.data;
};

export const deleteReferee = async (id: string) => {
  //   try {
  //     const data = await axios.delete(API_URL + `Referee/DeleteReferee/${id}`);
  //     return data;
  //   } catch (e) {
  //     console.log(e);
  //   }

  return await apiClient.delete(`Referee/DeleteReferee/${id}`);
};

export const getAllFreeReferees = async (id: string) => {
  const response = await apiClient.get(`Referee/GetAllFreeReferees/${id}`);
  return response.data;
};

export const getAllGamesForReferee = async (id: string) => {
  const response = await apiClient.get(`Referee/GetAllGamesForReferee/${id}`);
  return response.data;
};
