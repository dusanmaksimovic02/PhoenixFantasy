import { type FC, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import ProfileSidebar from "../components/ProfilePage/ProfileSidebar";
import ProfileContent from "../components/ProfilePage/ProfileContent";

const ProfilePage: FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hash = location.hash;

  return (
    <div className="min-h-screen pt-15 bg-white dark:bg-custom-gray text-neutral-900 dark:text-neutral-100">
      <div className="flex w-full relative">
        <ProfileSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="md:hidden flex items-center gap-4 px-4 py-4 border-b">
              <button onClick={() => setMobileOpen(true)} className="text-2xl">
                <FiMenu />
              </button>
              <span className="font-semibold">My Profile</span>
            </div>

            <ProfileContent section={hash.length == 0 ? "#info" : hash} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
