import { useState, type FC } from "react";
import { useAuth } from "../../context/auth/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { getUserData, updateUserWithRole } from "../../services/AuthService";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number (format: +381...)"),
});

type FormData = z.infer<typeof formSchema>;

const ProfileInfo: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, role, id } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.userName || "",
      name: user?.firstName || "",
      surname: user?.lastName || "",
      birthDate: user?.birthDate ? user.birthDate.toString().split("T")[0] : "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userUpdateData = {
        id: user!.id,
        userName: data.username,
        email: data.email,
        firstName: data.name,
        lastName: data.surname,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        password: "placeholder",
        role: role!,
      };

      await updateUserWithRole(userUpdateData, role!);

      toast.success("Profile updated successfully!");

      const updatedUser = await getUserData(id!, role!);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="w-full flex justify-center pt-8">
      <div className="w-full max-w-2xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
        <h1 className="text-3xl font-bold mb-8 text-center text-phoenix">
          Profile Information
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {[
            { id: "email", label: "Email", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "name", label: "Name", type: "text" },
            { id: "surname", label: "Surname", type: "text" },
            { id: "birthDate", label: "Birth date", type: "date" },
            { id: "phoneNumber", label: "Phone number", type: "text" },
          ].map((field) => (
            <div key={field.id}>
              <label className="block mb-1 font-medium text-neutral-600 dark:text-neutral-300">
                {field.label}
              </label>
              <input
                {...register(field.id as keyof FormData)}
                type={field.type}
                disabled={!isEditing}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white dark:bg-neutral-700
                  border border-neutral-300 dark:border-neutral-600
                  disabled:opacity-60 focus:ring-2 focus:ring-phoenix outline-none
                  transition-all
                "
              />
              {errors[field.id as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.id as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-center gap-4 mt-10">
            {!isEditing ? (
              <button
                type="button"
                className="px-10 py-3 rounded-xl text-white font-semibold bg-phoenix hover:bg-phoenix-dark transition-all cursor-pointer shadow-md"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="px-8 py-3 rounded-xl border border-neutral-400 dark:border-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all cursor-pointer"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 transition-all cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
