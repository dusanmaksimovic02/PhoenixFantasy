import type { FC, ReactNode } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import MyLeagues from "./MyLeagues";
import { toast } from "react-toastify";
import StartRound from "./StartRound";

const SECTION_MAP: Record<string, { component: ReactNode; roles: string[] }> = {
  "#info": {
    component: <ProfileInfo />,
    roles: ["User", "Admin", "Manager"],
  },
  "#security": {
    component: <ChangePassword />,
    roles: ["User", "Admin", "Manager"],
  },
  "#fantasy-leagues": {
    component: <MyLeagues />,
    roles: ["User"],
  },
  "#start-round": {
    component: <StartRound />,
    roles: ["Manager"],
  },
};

const ProfileContent: FC<{ section: string }> = ({ section }) => {
  const role = localStorage.getItem("role");

  const config = SECTION_MAP[section];

  if (!config) {
    toast.error("Invalid section");
    return <div></div>;
  }

  if (!config.roles.includes(role!)) {
    return;
  }

  return (
    <div className="rounded-xl mx-10 flex justify-center items-center overflow-auto p-6 min-h-[calc(100vh-6rem)]">
      {config.component}
    </div>
  );
};

export default ProfileContent;
