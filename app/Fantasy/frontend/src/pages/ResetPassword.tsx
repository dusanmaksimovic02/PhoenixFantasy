import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CiLock } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "../services/AuthService";

const ballVariants: Variants = {
  initial: { scale: 0, y: 200, opacity: 0 },
  animate: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 10 },
  },
  exit: {
    scale: 0,
    y: 200,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 10 },
  },
};

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
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

type FormData = z.infer<typeof passwordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => resetPassword(email, token, data.newPassword),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/login");
    },
    onError: () => toast.error("Invalid or expired token. Please request a new reset link."),
  });

  return (
    <div className="w-full h-full relative bg-court bg-no-repeat bg-cover bg-center max-sm:h-svh max-sm:w-svw">
      <div className="absolute inset-0 bg-black/40"></div>
      <AnimatePresence mode="wait">
        <motion.div
          className="relative flex justify-center items-center h-full w-full"
          variants={ballVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key={location.pathname}
        >
          <div className="w-screen h-screen relative bg-center translate-y-8 bg-basketballBall bg-no-repeat flex justify-center items-center bg-contain max-sm:bg-cover max-sm:bg-center">
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              className="w-full max-w-md p-7 bg-black/50 rounded-2xl max-sm:rounded-[70px] max-sm:my-2 max-sm:mx-8"
            >
              <h1 className="text-3xl font-bold text-center text-phoenix mb-2">
                Reset Password
              </h1>
              <p className="text-white text-center text-sm mb-5">
                Enter your new password below.
              </p>
              {(["newPassword", "confirmPassword"] as const).map((key) => (
                <div key={key} className="w-full block text-white mb-3">
                  <span className="label-text text-white font-semibold text-sm">
                    {key === "newPassword" ? "New Password" : "Confirm Password"}
                  </span>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      placeholder="********"
                      {...register(key)}
                      className="input w-full pl-10 hover:border-phoenix bg-transparent text-white border-2 border-white focus:border-phoenix focus:outline-phoenix focus:border-0 focus:my-2 rounded-md"
                    />
                    <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                  </div>
                  {errors[key] && (
                    <p className="text-red-400 text-sm mt-1">{errors[key]?.message}</p>
                  )}
                </div>
              ))}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-phoenix hover:bg-phoenix/80 cursor-pointer p-2 rounded-md font-bold text-white"
              >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full text-white text-sm mt-3 hover:text-phoenix transition text-center cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResetPassword;