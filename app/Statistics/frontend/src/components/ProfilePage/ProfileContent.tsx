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
    roles: ["Referee", "Admin", "Manager"],
  },
  "#security": {
    component: <ChangePassword />,
    roles: ["Referee", "Admin", "Manager"],
  },
  "#your-matches": {
    component: <YourMatches />,
    roles: ["Referee"],
  },
  "#all-games": {
    component: <AllGames />,
    roles: ["Manager", "Admin"],
  },
  "#all-referees": {
    component: <AllReferees />,
    roles: ["Manager", "Admin"],
  },
  "#all-manager": {
    component: <AllManager />,
    roles: ["Admin"],
  },
  "#add-referee": {
    component: <AddReferee />,
    roles: ["Admin", "Manager"],
  },
  "#add-manager": {
    component: <AddManager />,
    roles: ["Admin"],
  },
  "#add-game": {
    component: <AddGame />,
    roles: ["Admin"],
  },
};

const ProfileContent: FC<{ section: string }> = ({ section }) => {
  const role = localStorage.getItem("role");

  const config = SECTION_MAP[section];

  if (!config.roles.includes(role!)) {
    return;
  }

  return (
    <div className="rounded-xl mx-10 flex justify-center items-center overflow-auto p-6 mt-20 min-h-[calc(100vh-6rem)] ">
      {config.component}
    </div>
  );
};

export default ProfileContent;
