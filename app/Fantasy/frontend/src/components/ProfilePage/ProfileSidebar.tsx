import type { FC } from "react";
import { FiLogOut } from "react-icons/fi";
import clsx from "clsx";

export type ProfileSection =
  | "info"
  | "security"
  | "fantasy leagues"
  | "section3";

type SidebarProps = {
  active: ProfileSection;
  onChange: (s: ProfileSection) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const ProfileSidebar: FC<SidebarProps> = ({
  active,
  onChange,
  mobileOpen,
  setMobileOpen,
}) => {
  const itemClass = (key: ProfileSection) =>
    clsx(
      "px-6 py-3 rounded-xl cursor-pointer transition-all font-medium",
      active === key
        ? "bg-phoenix/80 text-white shadow"
        : "opacity-80 hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    );

  return (
    <>
      {/* mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "w-64 bg-neutral-100 dark:bg-custom-gray",
          "border-r border-neutral-300 dark:border-neutral-700",
          "z-50",
          // MOBILE
          "fixed top-16 left-0 h-[calc(100vh-4rem)] md:h-auto",
          // DESKTOP
          "md:sticky md:top-16",
          "transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex flex-col items-center border-b dark:border-neutral-700">
            <div className="w-24 h-24 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center opacity-70">
              Team image
            </div>
            <p className="mt-3 font-semibold">My Profile</p>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6">
            <ul className="space-y-4">
              <li className={itemClass("info")} onClick={() => onChange("info")}>
                Profile info
              </li>
              <li className={itemClass("security")} onClick={() => onChange("security")}>
                Change password
              </li>
              <li
                className={itemClass("fantasy leagues")}
                onClick={() => onChange("fantasy leagues")}
              >
                My leagues
              </li>
              <li className={itemClass("section3")} onClick={() => onChange("section3")}>
                Stavka 3
              </li>
            </ul>
          </div>

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
