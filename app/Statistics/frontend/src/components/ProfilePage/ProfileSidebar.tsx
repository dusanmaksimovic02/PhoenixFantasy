import { useAuth } from "../../context/auth/useAuth";
import { useEffect, type FC } from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

type ProfileTab = {
  key: string;
  label: string;
  roles: string[];
};

const PROFILE_TABS: ProfileTab[] = [
  {
    key: "#info",
    label: "Profile info",
    roles: ["referee", "manager", "admin"],
  },
  {
    key: "#security",
    label: "Change password",
    roles: ["referee", "manager", "admin"],
  },
  {
    key: "#your-matches",
    label: "Your matches",
    roles: ["referee"],
  },
  {
    key: "#all-games",
    label: "All Games",
    roles: ["manager", "admin"],
  },
  {
    key: "#all-manager",
    label: "All Manager",
    roles: ["admin"],
  },
  {
    key: "#all-referees",
    label: "All Referees",
    roles: ["manager", "admin"],
  },
  {
    key: "#add-referee",
    label: "Add referee",
    roles: ["manager", "admin"],
  },
  {
    key: "#add-manager",
    label: "Add manager",
    roles: ["admin"],
  },
  {
    key: "#add-game",
    label: "Add game",
    roles: ["admin", "manager"],
  },
];

const ProfileSidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const role = localStorage.getItem("role");

  const hash = location.hash;

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
  };

  useEffect(() => {
    const allowed = PROFILE_TABS.filter((tab) => tab.roles.includes(role!))
      .map((tab) => tab.key)
      .concat("");

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true });
    }
  }, [hash, navigate, role]);

  const visibleTabs = PROFILE_TABS.filter((tab) => tab.roles.includes(role!));

  const itemClass = (key: string) =>
    `px-3 py-3 rounded-xl cursor-pointer transition-all text-base font-medium text-nowrap ${
      (hash.length == 0 ? "#info" : hash) === key
        ? "bg-phoenix/80 hover:bg-phoenix text-white shadow-md"
        : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
    }`;

  return (
    <aside className="w-50 bg-neutral-100 dark:bg-custom-gray border-r border-neutral-300 dark:border-neutral-700 flex flex-col pt-15">
      <div className="min-h-[calc(100vh-3.75rem)] flex flex-col flex-1">
        <div className="text-center border-b py-4 border-neutral-300 dark:border-neutral-700">
          <p className=" text-2xl font-bold">My Profile</p>
          <p>{role}</p>
        </div>

        <div className="flex-1 overflow-auto py-6">
          <ul className="space-y-4 list-none px-5">
            {visibleTabs.map((tab) => (
              <li
                key={tab.key}
                className={itemClass(tab.key)}
                onClick={() => setHash(tab.key)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-neutral-300 dark:border-neutral-700">
          <button
            className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl
            bg-red-500/80 hover:bg-red-600
            text-white font-semibold transition cursor-pointer
          "
            onClick={logout}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 "></div>
    </aside>
  );
};

export default ProfileSidebar;
