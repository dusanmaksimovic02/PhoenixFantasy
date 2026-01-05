import type { LoginUser, User } from "@/models/User";
// import axios from "axios";

// const API_URL = "http://localhost:5104/api/Auth/";

const register = async (user: User) => {
  try {
    const data = {
      user: user,
      token: "!232e6532e5",
      role: "referee",
      id: "1"
    };
    return data;
  } catch (e) {
    console.log(e);
  }
};

const login = async (user: LoginUser) => {
  try {
    return user;
  } catch (e) {
    console.log(e);
  }
};

export { register, login };
