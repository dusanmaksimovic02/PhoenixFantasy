import { type FC } from "react";
import ProfileSidebar from "../components/ProfilePage/ProfileSidebar";
import ProfileContent from "../components/ProfilePage/ProfileContent";
import { useLocation } from "react-router-dom";

const Profile: FC = () => {
  const location = useLocation();

  const hash = location.hash;

  return (
    <div className="min-h-screen bg-white dark:bg-custom-gray text-neutral-900 dark:text-neutral-100">
      <div className="flex min-h-screen">
        <ProfileSidebar />

        <main className="flex-1 overflow-auto">
          <ProfileContent section={hash.length == 0 ? "#info" : hash} />
        </main>
      </div>
    </div>
  );
};

export default Profile;
