import { useEffect, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
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

const NAVBAR_HEIGHT = 64;
const FOOTER_HEIGHT = 96;

const ProfilePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState<ProfileSection>("info");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const section = hashToSection[location.hash];
    if (section) setActive(section);
    else navigate({ hash: sectionToHash.info }, { replace: true });
  }, [location.hash, navigate]);

  const handleChange = (section: ProfileSection) => {
    setActive(section);
    setMobileOpen(false);
    navigate({ hash: sectionToHash[section] }, { replace: true });
  };

  return (
    <div className="bg-white dark:bg-custom-gray">
      {/* prostor za fixed navbar */}
      <div style={{ height: NAVBAR_HEIGHT }} />

      {/* SCROLL CONTAINER */}
      <div
        className="flex overflow-hidden"
        style={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
        }}
      >
        <ProfileSidebar
          active={active}
          onChange={handleChange}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="md:hidden flex items-center gap-4 px-4 py-4 border-b">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-2xl"
            >
              <FiMenu />
            </button>
            <span className="font-semibold">My Profile</span>
          </div>

          <div className="flex justify-center p-4 md:p-10">
            <div className="w-full max-w-6xl">
              <ProfileContent section={active} />
            </div>
          </div>
        </main>
      </div>

      {/* footer space */}
      <div style={{ height: FOOTER_HEIGHT }} />
    </div>
  );
};

export default ProfilePage;
