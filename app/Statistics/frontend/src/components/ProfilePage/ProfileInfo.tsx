import axios from "axios";
import { useAuth } from "../../context/auth/useAuth";
import { useState, type FC } from "react";
import { z } from "zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string(),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number"),
});

type FormData = z.infer<typeof formSchema>;

const ProfileInfo: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user, role, id } = useAuth();

  const [profile, setProfile] = useState<FormData>({
    email: user!.email,
    username: user!.userName,
    name: user!.firstName,
    surname: user!.lastName,
    birthDate: new Date().toDateString(),
    phoneNumber: user!.phoneNumber,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    const result = formSchema.safeParse(profile);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await axios.put("http://localhost:5086/Referee/UpdateReferee/", {
        userName: profile.username,
        email: profile.email,
        firstName: profile.name,
        lastName: profile.surname,
        birthDate: profile.birthDate,
        phoneNumber: profile.phoneNumber,
        id: user!.id,
      });

      toast.success("Profile updated successfully!");

      try {
        const res = await axios.get(
          `http://localhost:5086/${role}/Get${role}ById/${id}`,
        );
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (e) {
        console.log("Error getting user data: ", e);
      }

      setErrors({});
      setIsEditing(false);
    } catch (e) {
      toast.error("Update failed!");
      console.log("Update failed: " + e);
    }
  };

  return (
    <div className="w-full flex justify-center pt-8">
      <div
        className="
          w-full max-w-2xl rounded-2xl p-8 shadow-lg
          bg-neutral-100 dark:bg-neutral-800
        "
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Profile information
        </h1>

        <div className="space-y-5">
          {(
            [
              ["email", "Email"],
              ["username", "Username"],
              ["name", "Name"],
              ["surname", "Surname"],
              ["birthDate", "Birth date"],
              ["phoneNumber", "Phone number"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                name={key}
                type={key === "birthDate" ? "date" : "text"}
                value={profile[key]}
                disabled={!isEditing}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white dark:bg-neutral-700
                  border border-neutral-300 dark:border-neutral-600
                  disabled:opacity-70
                "
              />
              {errors[key] && (
                <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="px-10 py-3 rounded-xl text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Save changes" : "Edit profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
