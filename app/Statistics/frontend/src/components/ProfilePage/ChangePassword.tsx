import { useState, type FC } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password lenght must be least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);

  const verifyOld = () => {
    if (oldPassword !== "password123") {
      toast.error("Old password is incorrect");
      return;
    }
    toast.success("Old password verified");
    setVerified(true);
  };

  const save = () => {
    const res = passwordSchema.safeParse(form);
    if (!res.success) {
      const e: Record<string, string> = {};
      res.error.issues.forEach((i) => {
        e[i.path[0] as string] = i.message;
      });
      setErrors(e);
      return;
    }

    toast.success("Password successfully changed");
    setOldPassword("");
    setForm({ newPassword: "", confirmPassword: "" });
    setVerified(false);
    setErrors({});
  };

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="w-full max-w-xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Change password
        </h1>

        
        <div className="mb-6">
          <label className="block mb-1 font-medium">Old password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border"
          />
          {!verified && (
            <button
              className="mt-4 px-6 py-2 rounded-xl bg-phoenix/70 hover:bg-phoenix text-white font-semibold cursor-pointer"
              onClick={verifyOld}
            >
              Verify
            </button>
          )}
        </div>

       
        {verified && (
          <div className="space-y-5">
            {(["newPassword", "confirmPassword"] as const).map((key) => (
              <div key={key} className="relative">
                <label className="block mb-1 font-medium">
                  {key === "newPassword"
                    ? "New password"
                    : "Confirm password"}
                </label>
                <input
                  type={show ? "text" : "password"}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border"
                />
                <button
                  type="button"
                  className="absolute right-4 top-10 opacity-70 cursor-pointer"
                  onClick={() => setShow((p) => !p)}
                >
                  {show ? <FiEyeOff /> : <FiEye />}
                </button>
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <button
                className="px-10 py-3 rounded-xl bg-phoenix/70 hover:bg-phoenix text-white font-semibold cursor-pointer"
                onClick={save}
              >
                Save new password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
