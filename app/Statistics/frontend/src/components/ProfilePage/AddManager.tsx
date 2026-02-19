import { registerUserWithRole } from "../../services/api";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string(),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must include at least one number." })
    .regex(/[@$!%*?&#]/, {
      message: "Password must include at least one special character.",
    }),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number"),
  role: z.literal("Manager"),
});

type FormData = z.infer<typeof formSchema>;

const AddManager: FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profile, setProfile] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    name: "",
    surname: "",
    birthDate: Date(),
    phoneNumber: "",
    role: "Manager",
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
      await registerUserWithRole({
        userName: profile.username,
        email: profile.email,
        password: profile.password,
        firstName: profile.name,
        lastName: profile.surname,
        phoneNumber: profile.phoneNumber,
        birthDate: new Date(profile.birthDate),
        id: "",
        role: "",
      });

      console.log("Manager created!");
      toast.success("Manager created successfully!");
      setErrors({});
      setProfile({
        email: "",
        username: "",
        name: "",
        surname: "",
        birthDate: Date(),
        phoneNumber: "",
        password: "",
        role: "Manager",
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Manager</h1>

      <div className="space-y-5">
        {(
          [
            ["email", "Email"],
            ["username", "Username"],
            ["password", "Password"],
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
          onClick={handleSave}
        >
          Add manager
        </button>
      </div>
    </div>
  );
};

export default AddManager;
