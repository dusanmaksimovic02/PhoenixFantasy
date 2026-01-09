import type { FC, ReactNode } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import YourMatches from "./YourMatches";
import AddReferee from "./AddReferee";
import AddManager from "./AddManager";
import AllGames from "./AllGames";
import AllReferees from "./AllReferees";
import AllManager from "./AllManager";
import AddGame from "./AddGame";

const SECTION_MAP: Record<string, { component: ReactNode; roles: string[] }> = {
  "#info": {
    component: <ProfileInfo />,
    roles: ["referee", "admin", "manager"],
  },
  "#security": {
    component: <ChangePassword />,
    roles: ["referee", "admin", "manager"],
  },
  "#your-matches": {
    component: <YourMatches />,
    roles: ["referee"],
  },
  "#all-games": {
    component: <AllGames />,
    roles: ["manager", "admin"],
  },
  "#all-referees": {
    component: <AllReferees />,
    roles: ["manager", "admin"],
  },
  "#all-manager": {
    component: <AllManager />,
    roles: ["admin"],
  },
  "#add-referee": {
    component: <AddReferee />,
    roles: ["admin", "manager"],
  },
  "#add-manager": {
    component: <AddManager />,
    roles: ["admin"],
  },
  "#add-game": {
    component: <AddGame />,
    roles: ["admin"],
  },
};

const ProfileContent: FC<{ section: string }> = ({ section }) => {
  const role = localStorage.getItem("role");

  const config = SECTION_MAP[section];

  if (!config.roles.includes(role!)) {
    return;
  }

  return (
    <div className="rounded-xl mx-10 flex justify-center items-center overflow-auto p-6 mt-20 min-h-[calc(100vh-6rem)] bg-neutral-100 dark:bg-neutral-800">
      {config.component}
    </div>
  );
};

export default ProfileContent;
