import type { FC, ReactNode } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import MyLeagues from "./MyLeagues";

const SECTION_MAP: Record<string, ReactNode> = {
  "#info": <ProfileInfo />,
  "#security": <ChangePassword />,
  "#fantasy-leagues": <MyLeagues />,
  "#section3": <div>Stavka 3</div>,
};

const ProfileContent: FC<{ section: string }> = ({ section }) => {
  const content = SECTION_MAP[section] ?? SECTION_MAP["#info"];

  return (
    <div className="flex justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-6">
        {content}
      </div>
    </div>
  );
};

export default ProfileContent;
