import { useEffect, useState, type FC } from "react";
import ProfileSidebar, {
  type ProfileSection,
} from "../components/ProfilePage/ProfileSidebar";
import ProfileContent from "../components/ProfilePage/ProfileContent";

const ProfilePage: FC = () => {
  const [active, setActive] = useState<ProfileSection>("info");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as ProfileSection;
    if (hash) setActive(hash);
  }, []);

  const handleChange = (section: ProfileSection) => {
    setActive(section);
    window.location.hash = section;
  };

  return (
    <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* SIDEBAR */}
      <ProfileSidebar active={active} onChange={handleChange} />

      {/* CONTENT */}
      <main className="ml-64 p-8 min-h-screen">
        <ProfileContent section={active} />
      </main>
    </div>
  );
};

export default ProfilePage;
