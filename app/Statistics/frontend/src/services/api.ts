import axios from "axios";
import type { User } from "../models/User";

const API_URL = "http://localhost:5086/";

export const registerUserWithRole = async (user: User) => {
  try {
    const data = await axios.post(API_URL + "api/Auth/RegisterWithRole", {
      role: user.role,
      userName: user.userName,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getMangers = async () => {
  try {
    const data = await axios.get(API_URL + "Manager/GetManagers");
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteManager = async (id: string) => {
  try {
    const data = await axios.delete(API_URL + `Manager/DeleteManager/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getReferees = async () => {
  try {
    const data = await axios.get(API_URL + "Referee/GetReferees");
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteReferee = async (id: string) => {
  try {
    const data = await axios.delete(API_URL + `Referee/DeleteReferee/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};
