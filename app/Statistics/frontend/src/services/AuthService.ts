import type { LoginUser, User } from "@/models/User";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5086/api/Auth/";

const register = async (user: User) => {
  try {
    const data = await axios.post(API_URL + "Register", {
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
    const data = await axios.post(API_URL + "Login", {
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

const getUserData = async (id: string, role: string) => {
  try {
    const res = await axios.get(
      `http://localhost:5086/${role}/Get${role}ById/${id}`,
    );
    return res.data;
  } catch (e) {
    console.log("Error getting user data: ", e);
  }
};

export { register, login, getUserData };
