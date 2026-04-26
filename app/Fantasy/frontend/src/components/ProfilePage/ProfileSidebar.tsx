import { useEffect, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/auth/useAuth";

type ProfileTab = {
  key: string;
  label: string;
  roles: string[];
};

const PROFILE_TABS: ProfileTab[] = [
  {
    key: "#info",
    label: "Profile info",
    roles: ["User", "Manager", "Admin"],
  },
  {
    key: "#security",
    label: "Change password",
    roles: ["User", "Manager", "Admin"],
  },
  {
    key: "#fantasy-leagues",
    label: "My leagues",
    roles: ["User"],
  },
  {
    key: "#start-round",
    label: "Start round",
    roles: ["Manager"],
  },
  {
    key: "#players",
    label: "Players",
    roles: ["Manager"],
  },
  {
    key: "#coaches",
    label: "Coaches",
    roles: ["Manager"],
  },
];

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const ProfileSidebar: FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const role = localStorage.getItem("role");

  const hash = location.hash;

  useEffect(() => {
    const allowed = PROFILE_TABS.filter((tab) => tab.roles.includes(role!))
      .map((tab) => tab.key)
      .concat("");

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true });
    }
  }, [hash, navigate, role]);

  const visibleTabs = PROFILE_TABS.filter((tab) => tab.roles.includes(role!));

  const goTo = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`w-50 bg-neutral-100 dark:bg-custom-gray border-r border-neutral-300 dark:border-neutral-700 flex flex-col transition-transform absolute md:relative z-50 md:z-auto md:h-auto md:overflow-visible ${
          mobileOpen
            ? "fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-[calc(100vh-3.75rem)] ">
          <div className="p-6 flex flex-col items-center border-b dark:border-neutral-700">
            <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
              Team image
            </div>
            <p className="mt-3 font-semibold">My Profile</p>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-4 list-none p-0 m-0">
              {visibleTabs.map((t) => (
                <li
                  key={t.key}
                  onClick={() => goTo(t.key)}
                  className={`px-3 py-3 rounded-xl cursor-pointer transition-all text-base font-medium text-nowrap ${
                    (hash.length == 0 ? "#info" : hash) === t.key
                      ? "bg-phoenix/80 hover:bg-phoenix text-white shadow-md"
                      : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {t.label}
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-neutral-300 dark:border-neutral-700">
            <button
              className=" w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-white font-semibold transition cursor-pointer"
              onClick={() => logout(false)}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 "></div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
