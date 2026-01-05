import { useAuth } from "../context/auth/useAuth";
import type { FC } from "react";

const Profile: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="pt-16 w-screen h-screen flex flex-col">
      {user ? JSON.stringify(user) : "user"}
      <button className="btn" onClick={logout}>
        logout
      </button>
    </div>
  );
};

export default Profile;
