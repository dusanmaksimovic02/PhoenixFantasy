import { useNavigate } from "react-router-dom";
import type { LoginUser, User } from "../../models/User";
import { useState, type FC, type ReactNode } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

type Props = { children: ReactNode };

export const AuthProvider: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isReady, setIsReady] = useState<boolean>(true);
  const [role, setRole] = useState<string>(
    () => localStorage.getItem("role") ?? ""
  );
  const [id, setId] = useState<string>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored).id : "";
  });

  const register = async (user: User) => {
    //  const user : = {
    // id: "1",
    // email: "proba@gmail.com",
    // password: "#Sifra123",
    // name: "Name",
    // surname: "Surname",
    // username: "username",
    // birthDate: Date(),
    // phone: "+381646353265",
    // gander: "male",
    // role: "referee",
    // });

    const data = {
      user: user,
      token: "!232e6532e5",
      role: "referee",
      id: "1",
    };

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    localStorage.setItem("role", data.role);
    setRole(data.role);
    setId(data.id);

    setIsReady(true);

    toast.success("Register success!");
    navigate("/login");
  };

  const login = async (user: LoginUser) => {
    const user2 = {
      id: "1",
      email: "proba@gmail.com",
      password: user.password,
      name: "Name",
      surname: "Surname",
      username: user.username,
      birthDate: new Date(),
      phone: "+381646353265",
      gender: "male",
      role: "manager",
    };
    const data = {
      user: user2,
      token: "!232e6532e5",
      role: "manager",
      id: "1",
    };

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    localStorage.setItem("role", data.role);
    setRole(data.role);
    setId(data.id);

    setIsReady(true);

    toast.success("Login success!");
    navigate("/profile");
  };

  const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("token");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success(`You're logged out`);
    setUser(null);
    setToken("");
    setRole("");
    setId("");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        user,
        token,
        logout,
        isLoggedIn,
        role,
        id,
      }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};
