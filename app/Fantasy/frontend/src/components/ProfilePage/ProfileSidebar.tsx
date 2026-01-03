import type { FC } from "react";

export type ProfileSection =
  | "info"
  | "security"
  | "fantasy leagues"
  | "section3";

type SidebarProps = {
  active: ProfileSection;
  onChange: (s: ProfileSection) => void;
};

const ProfileSidebar: FC<SidebarProps> = ({ active, onChange }) => {
  const itemClass = (key: ProfileSection) =>
    `
      px-6 py-3 rounded-xl cursor-pointer transition-all
      text-base font-medium
      ${
        active === key
          ? "bg-phoenix/80 text-white shadow-md"
          : "opacity-80 hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }
    `;

  return (
    <aside
      className="
        sticky top-0
        w-64 h-screen
        bg-neutral-100 dark:bg-neutral-900
        border-r border-neutral-300 dark:border-neutral-700
        float-left
      "
    >
      <div className="flex flex-col justify-center h-full px-4">
        <ul className="space-y-4 list-none">
          <li className={itemClass("info")} onClick={() => onChange("info")}>
            Profile info
          </li>
          <li
            className={itemClass("security")}
            onClick={() => onChange("security")}
          >
            Change Password
          </li>
          <li
            className={itemClass("fantasy leagues")}
            onClick={() => onChange("fantasy leagues")}
          >
            My Leagues
          </li>
          <li
            className={itemClass("section3")}
            onClick={() => onChange("section3")}
          >
            Stavka 3
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
