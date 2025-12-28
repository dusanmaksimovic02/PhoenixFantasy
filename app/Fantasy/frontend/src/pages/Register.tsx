import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { toast } from "react-toastify";
import { PiGenderIntersexBold } from "react-icons/pi";
import { LuPhone } from "react-icons/lu";
import { forwardRef, useId, type FC } from "react";

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

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required!" }),
    surname: z.string().min(1, { message: "Surname is required!" }),
    username: z.string().min(1, { message: "Username is required!" }),
    email: z.string().email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters!" })
      .regex(/[a-z]/, {
        message: "Password must include at least one lowercase letter!",
      })
      .regex(/[A-Z]/, {
        message: "Password must include at least one uppercase letter!",
      })
      .regex(/[0-9]/, { message: "Password must include at least one number!" })
      .regex(/[@$!%*?&#]/, {
        message: "Password must include at least one special character!",
      }),
    confirmPassword: z.string(),
    birthDate: z.date({ message: "Invalid date!" }),
    gender: z.string().regex(/^(male|female|)$/, {
      message: "Invalid gender! Gender can be male or female!",
    }),
    phoneNumber: z.string().regex(/^\+[1-9]\d{1,3}[1-9]\d{6,10}$/, {
      message:
        "Phone number must be in the format +<country_code><phone_number>!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });

type FormInputs = z.infer<typeof formSchema>;

type TextFieldProps = {
  label: string;
  error?: string;
  icon: React.ElementType;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon: Icon, type = "text", ...props }, ref) => {
    const id = useId();

    return (
      <label htmlFor={id} className="w-full block text-white mb-3 ">
        <span className="label">
          <span className="label-text text-white font-semibold text-sm">
            {label}
          </span>
        </span>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={type}
            {...props}
            className={`
              input w-full pl-10 hover:border-phoenix 
              bg-transparent text-white border-2
              border-white focus:border-phoenix focus:outline-phoenix focus:border-0 rounded-md
              ${error ? "input-error" : ""}
            `}
          />

          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
          )}
        </div>

        {error && (
          <span className="text-error text-sm font-semibold mt-5">{error}</span>
        )}
      </label>
    );
  }
);

const Register: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: undefined,
      phoneNumber: "",
      gender: "",
    },
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  function onSubmit(data: FormInputs) {
    console.log(data);
    toast.info(
      `${data.username}\n ${data.name}\n ${data.surname} \n${data.email}\n ${data.password}\n ${data.birthDate}\n${data.gender}`
    );
  }

  const nameError = errors.name?.message;
  const usernameError = errors.username?.message;
  const surnameError = errors.surname?.message;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const birthDateError = errors.birthDate?.message;
  const genderError = errors.gender?.message;
  const phoneNumberError = errors.phoneNumber?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  return (
    <div className="w-screen h-screen relative bg-court bg-no-repeat bg-cover bg-center **:max-sm:h-svh max-sm:w-svw transition-all duration-1000">
      <div className="absolute inset-0 bg-black/40"></div>
      <AnimatePresence mode="wait">
        <motion.div
          className="relative flex justify-center items-center h-full w-full"
          variants={ballVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="w-screen h-screen relative bg-center bg-basketballBall bg-no-repeat flex justify-center items-center bg-contain max-sm:bg-cover max-sm:bg-center max-sm:w-112.5 max-sm:h-162.5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md px-7 py-2 bg-black/50 rounded-[90px] max-sm:m-5"
            >
              <h2 className="text-3xl font-bold text-center text-phoenix">
                Register
              </h2>
              <TextField
                type="email"
                label="Email Address"
                error={emailError}
                icon={IoMailOutline}
                placeholder="someone@example.com"
                {...register("email")}
              />
              <div className="flex gap-3">
                <TextField
                  label="Name"
                  error={nameError}
                  icon={CgProfile}
                  placeholder="Name"
                  {...register("name")}
                />
                <TextField
                  label="Surname"
                  error={surnameError}
                  icon={CgProfile}
                  placeholder="Surname"
                  {...register("surname")}
                />
              </div>
              <div className="flex gap-3">
                <TextField
                  label="Username"
                  error={usernameError}
                  icon={CgProfile}
                  placeholder="Username"
                  {...register("username")}
                />
                <div className="w-[55%]">
                  <label className="block text-white text-sm font-semibold ">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    color="white"
                    {...register("birthDate", { valueAsDate: true })}
                    className={`w-full bg-transparent rounded-md px-3 py-[0.4rem] border-white hover:border-phoenix focus:border-phoenix border-2 text-white ${
                      birthDateError ? "border-red-500" : ""
                    }`}
                  />
                  {birthDateError && (
                    <p className="font-semibold input-error">
                      {birthDateError}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  error={passwordError}
                  icon={CiLock}
                  placeholder="********"
                  {...register("password")}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Confirm Password"
                  error={confirmPasswordError}
                  icon={CiLock}
                  placeholder="********"
                  {...register("confirmPassword")}
                />
              </div>
              <div className="flex justify-end gap-2 items-center">
                <input
                  id="show-password"
                  type="checkbox"
                  className="checkbox checkbox-neutral border-white border-2 checked:bg-phoenix"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                />

                <label
                  htmlFor="show-password"
                  className="cursor-pointer text-white select-none"
                >
                  Show Password
                </label>
              </div>
              <div className="flex gap-3">
                <TextField
                  label="Gender"
                  error={genderError}
                  icon={PiGenderIntersexBold}
                  placeholder="male/female"
                  {...register("gender")}
                />
                <TextField
                  label="Phone number"
                  error={phoneNumberError}
                  icon={LuPhone}
                  placeholder="phone number"
                  {...register("phoneNumber")}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-phoenix hover:border-phoenix cursor-pointer hover:bg-phoenix/80 hover:border-2  p-2 rounded-md font-bold"
              >
                Register
              </button>
              <p className="my-4 flex items-center justify-center gap-1 text-white">
                Already have an account?
                <Link className="font-bold text-phoenix" to={"/login"}>
                  Sign in instead
                </Link>
              </p>
            </form>
          </div>
          <button
            className="cursor-pointer border-2 p-2 text-white rounded-md border-black hover:border-black bg-black/30 absolute right-5 bottom-5 hover:bg-black/50"
            onClick={() => {
              navigate("/");
            }}
          >
            Go home
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Register;
