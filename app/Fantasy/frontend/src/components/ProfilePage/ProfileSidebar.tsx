import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import clsx from "clsx";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const TABS = [
  { key: "#info", label: "Profile info" },
  { key: "#security", label: "Change password" },
  { key: "#fantasy-leagues", label: "My leagues" },
  { key: "#section3", label: "Stavka 3" },
];

const ProfileSidebar: FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hash = location.hash.length === 0 ? "#info" : location.hash;

  const goTo = (value: string) => {
    navigate({ hash: value }, { replace: true });
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
        className={clsx(
          "w-64 bg-neutral-100 dark:bg-custom-gray border-r border-neutral-300 dark:border-neutral-700 transition-transform",
          "absolute md:relative z-50 md:z-auto",
          "md:h-auto md:overflow-visible",
          mobileOpen
            ? "fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto translate-x-0"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col min-h-full">
          <div className="p-6 flex flex-col items-center border-b dark:border-neutral-700">
            <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
              Team image
            </div>
            <p className="mt-3 font-semibold">My Profile</p>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-4 list-none p-0 m-0">
              {TABS.map((t) => (
                <li
                  key={t.key}
                  onClick={() => goTo(t.key)}
                  className={clsx(
                    "px-6 py-3 rounded-xl cursor-pointer transition-all font-medium",
                    hash === t.key
                      ? "bg-phoenix/80 text-white shadow"
                      : "opacity-80 hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                  )}
                >
                  {t.label}
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t dark:border-neutral-700">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-white font-semibold">
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
