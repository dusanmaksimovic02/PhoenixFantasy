import type { LoginUser, User } from "@/models/User";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  token: string | null;
  register: (user: User) => void;
  login: (user: LoginUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  role: string;
  id: string;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
