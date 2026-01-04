import { useEffect, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileSidebar, {
  type ProfileSection,
} from "../components/ProfilePage/ProfileSidebar";
import ProfileContent from "../components/ProfilePage/ProfileContent";


const sectionToHash: Record<ProfileSection, string> = {
  info: "#info",
  security: "#security",
  "fantasy leagues": "#fantasy-leagues",
  section3: "#section3",
};

const hashToSection: Record<string, ProfileSection> = {
  "#info": "info",
  "#security": "security",
  "#fantasy-leagues": "fantasy leagues",
  "#section3": "section3",
};

const ProfilePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState<ProfileSection>("info");

  
  useEffect(() => {
    const section = hashToSection[location.hash];

    if (section) {
      setActive(section);
    } else {
      navigate(
        { hash: sectionToHash.info },
        { replace: true }
      );
    }
  }, [location.hash, navigate]);

 
  const handleChange = (section: ProfileSection) => {
    setActive(section);
    navigate(
      { hash: sectionToHash[section] },
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-custom-gray text-neutral-900 dark:text-neutral-100">
      <div className="flex min-h-screen py-11">
        <ProfileSidebar active={active} onChange={handleChange} />

        <main className="flex-1 p-14">
          <ProfileContent section={active} />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
