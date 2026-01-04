import type { FC } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import MyLeagues from "./MyLeagues";
import type { ProfileSection } from "./ProfileSidebar";

const ProfileContent: FC<{ section: ProfileSection }> = ({ section }) => {
  return (
    <div className="rounded-xl p-6 bg-neutral-100 dark:bg-neutral-800">
      {section === "info" && <ProfileInfo />}
      {section === "security" && <ChangePassword />}
      {section === "fantasy leagues" && <MyLeagues />}
      {section === "section3" && <div>Stavka 3</div>}
    </div>
  );
};

export default ProfileContent;
