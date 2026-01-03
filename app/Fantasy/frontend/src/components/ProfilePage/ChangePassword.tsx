import { useState, type FC } from "react";
import { z } from "zod";


const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [oldPasswordError, setOldPasswordError] = useState("");

  

  const handleVerifyOldPassword = () => {
    
    if (oldPassword !== "password123") {
      setOldPasswordError("Old password is incorrect");
      return;
    }

    setOldPasswordError("");
    setIsVerified(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    const result = passwordSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    alert("Password successfully changed (mock)");
    setOldPassword("");
    setForm({ newPassword: "", confirmPassword: "" });
    setIsVerified(false);
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
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
          />
          {oldPasswordError && (
            <p className="text-red-500 text-sm mt-1">{oldPasswordError}</p>
          )}

          {!isVerified && (
            <button
              className="mt-4 px-6 py-2 rounded-xl font-semibold text-white
                bg-phoenix/70 hover:bg-phoenix transition-all cursor-pointer"
              onClick={handleVerifyOldPassword}
            >
              Verify
            </button>
          )}
        </div>

        
        {isVerified && (
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">New password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <button
                className="px-10 py-3 rounded-xl text-white font-semibold
                  bg-phoenix/70 hover:bg-phoenix transition-all cursor-pointer"
                onClick={handleSave}
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
