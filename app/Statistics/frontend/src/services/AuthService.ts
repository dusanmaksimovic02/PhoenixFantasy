import type { LoginUser, User } from "@/models/User";
import axios from "axios";
import { toast } from "react-toastify";
import apiClient from "./client";

const register = async (user: User) => {
  try {
    const data = await apiClient.post("api/AuthRegister", {
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

const login = async (user: LoginUser) => {
  try {
    const data = await apiClient.post("api/Auth/Login", {
      userName: user.username,
      password: user.password,
    });
    return data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const message = e.response.data?.message || "Login failed";
      toast.error(message);
      console.log("LOGIN ERROR:", message);
    } else {
      toast.error("Login failed! Please try again later.");
      console.log(e);
    }
  }
};

export const registerUserWithRole = async (user: User) => {
  try {
    const data = await apiClient.post("api/Auth/RegisterWithRole", {
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

const getUserData = async (id: string, role: string) => {
  try {
    const res = await apiClient.get(`api/${role}/Get${role}ById/${id}`);
    return res.data;
  } catch (e) {
    console.log("Error getting user data: ", e);
  }
};

export { register, login, getUserData };
