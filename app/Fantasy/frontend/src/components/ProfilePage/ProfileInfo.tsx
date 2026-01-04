import { useState, type FC } from "react";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string(),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string(),
  gender: z.string(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number"),
});

type FormData = z.infer<typeof formSchema>;

const ProfileInfo: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profile, setProfile] = useState<FormData>({
    email: "phoenix@example.com",
    username:"Dzoni",
    name: "Nikola",
    surname: "Nikolić",
    birthDate: "1999-05-12",
    gender: "male",
    phoneNumber: "+381641234567",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    const result = formSchema.safeParse(profile);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsEditing(false);
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
              ["gender", "Gender"],
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
