import { useState, type FC } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/auth/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyPassword, changePassword } from "../../services/AuthService";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof passwordSchema>;

const ChangePassword: FC = () => {
  const { id } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyPassword(id, oldPassword),
    onSuccess: () => {
      toast.success("Old password verified!");
      setVerified(true);
    },
    onError: () => toast.error("Old password is incorrect."),
  });

  const changeMutation = useMutation({
    mutationFn: (data: FormData) =>
      changePassword(id, oldPassword, data.newPassword),
    onSuccess: () => {
      toast.success("Password changed! A confirmation email has been sent.");
      setOldPassword("");
      setVerified(false);
      reset();
    },
    onError: () => toast.error("Failed to change password."),
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
        <h1 className="text-3xl font-bold mb-8 text-center">Change Password</h1>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={verified}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border disabled:opacity-60"
          />
          {!verified && (
            <button
              className="mt-4 px-6 py-2 rounded-xl bg-phoenix/70 hover:bg-phoenix text-white font-semibold cursor-pointer transition"
              onClick={() => verifyMutation.mutate()}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify"}
            </button>
          )}
          {verified && (
            <p className="text-green-500 text-sm mt-2 font-medium">
              ✓ Old password verified
            </p>
          )}
        </div>

        {verified && (
          <form onSubmit={handleSubmit((data) => changeMutation.mutate(data))}>
            <div className="space-y-5">
              {(["newPassword", "confirmPassword"] as const).map((key) => (
                <div key={key} className="relative">
                  <label className="block mb-1 font-medium">
                    {key === "newPassword"
                      ? "New Password"
                      : "Confirm Password"}
                  </label>
                  <input
                    type={show ? "text" : "password"}
                    {...register(key)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border"
                  />
                  {key === "newPassword" && (
                    <button
                      type="button"
                      className="absolute right-4 top-10 opacity-70 cursor-pointer"
                      onClick={() => setShow((p) => !p)}
                    >
                      {show ? <FiEyeOff /> : <FiEye />}
                    </button>
                  )}
                  {errors[key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[key]?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl bg-phoenix/70 hover:bg-phoenix text-white font-semibold cursor-pointer transition"
                  disabled={changeMutation.isPending}
                >
                  {changeMutation.isPending ? "Saving..." : "Save New Password"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
