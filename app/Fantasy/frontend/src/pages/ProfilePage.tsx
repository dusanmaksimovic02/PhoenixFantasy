import { useState, type FC } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { PiGenderIntersexBold } from "react-icons/pi";



type ProfileSection = "info" | "security" | "section2" | "section3";

type ProfileFieldProps = {
  label: string;
  value: string;
  name?: string;
  type?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};



const ProfileField: FC<ProfileFieldProps> = ({
  label,
  value,
  name,
  type = "text",
  icon: Icon,
  disabled,
  onChange,
}) => {
  return (
    <label className="w-full block text-white mb-4">
      <span className="text-sm font-semibold">{label}</span>

      <div className="relative mt-1">
        <input
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`
            w-full pl-10 pr-3 py-2 rounded-md bg-transparent
            border-2 border-white text-white
            focus:outline-none focus:border-phoenix
            disabled:opacity-60
          `}
        />

        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-lg pointer-events-none" />
        )}
      </div>
    </label>
  );
};



type SidebarProps = {
  active: ProfileSection;
  onChange: (s: ProfileSection) => void;
};

const ProfileSidebar: FC<SidebarProps> = ({ active, onChange }) => {
  const itemClass = (key: ProfileSection) =>
    `px-4 py-3 rounded-lg cursor-pointer transition
     ${
       active === key
         ? "bg-phoenix text-black font-semibold"
         : "hover:bg-white/10"
     }`;

  return (
    <aside className="w-64 border-r border-white/10 p-6">
      <h2 className="text-xl font-bold mb-6">Profile</h2>

      <ul className="space-y-2">
        <li className={itemClass("info")} onClick={() => onChange("info")}>
          Profile info
        </li>
        <li
          className={itemClass("security")}
          onClick={() => onChange("security")}
        >
          Security
        </li>
        <li
          className={itemClass("section2")}
          onClick={() => onChange("section2")}
        >
          Stavka 2
        </li>
        <li
          className={itemClass("section3")}
          onClick={() => onChange("section3")}
        >
          Stavka 3
        </li>
      </ul>
    </aside>
  );
};



type ContentProps = {
  section: ProfileSection;
};

const ProfileContent: FC<ContentProps> = ({ section }) => {
  return (
    <div className="w-full h-full bg-black/40 rounded-2xl p-8 overflow-auto">
      {section === "info" && <ProfileInfo />}
      {section === "security" && <SecuritySection />}
      {section === "section2" && <Placeholder title="Stavka 2" />}
      {section === "section3" && <Placeholder title="Stavka 3" />}
    </div>
  );
};



const ProfileInfo: FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    username: "phoenix23",
    email: "phoenix@example.com",
    name: "Nikola",
    surname: "Nikolić",
    birthDate: "1999-05-12",
    gender: "male",
    phoneNumber: "+381641234567",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name!]: e.target.value });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Profile information</h1>

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-phoenix/30 flex items-center justify-center text-4xl">
          <CgProfile />
        </div>
      </div>

      <ProfileField label="Username" value={profile.username} disabled />

      <ProfileField
        label="Email"
        name="email"
        value={profile.email}
        icon={IoMailOutline}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <div className="flex gap-4">
        <ProfileField
          label="Name"
          name="name"
          value={profile.name}
          icon={CgProfile}
          disabled={!isEditing}
          onChange={handleChange}
        />
        <ProfileField
          label="Surname"
          name="surname"
          value={profile.surname}
          icon={CgProfile}
          disabled={!isEditing}
          onChange={handleChange}
        />
      </div>

      <ProfileField
        label="Birth date"
        type="date"
        name="birthDate"
        value={profile.birthDate}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <ProfileField
        label="Gender"
        name="gender"
        value={profile.gender}
        icon={PiGenderIntersexBold}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <ProfileField
        label="Phone number"
        name="phoneNumber"
        value={profile.phoneNumber}
        icon={LuPhone}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <button
        className="mt-6 px-6 py-2 rounded-xl bg-phoenix text-black font-semibold hover:opacity-90"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        {isEditing ? "Save changes" : "Edit profile"}
      </button>
    </>
  );
};



const SecuritySection: FC = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Security</h1>
      <p className="opacity-80">
        Ovde će kasnije ići promene lozinke, 2FA, itd.
      </p>
    </>
  );
};



const Placeholder: FC<{ title: string }> = ({ title }) => (
  <>
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="opacity-70">Sadržaj za {title}.</p>
  </>
);



const ProfilePage: FC = () => {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("info");

  return (
    <div className="w-screen h-screen flex bg-[#0b0b0b] text-white">
      <ProfileSidebar
        active={activeSection}
        onChange={setActiveSection}
      />

      <div className="flex-1 p-10">
        <ProfileContent section={activeSection} />
      </div>
    </div>
  );
};

export default ProfilePage;
