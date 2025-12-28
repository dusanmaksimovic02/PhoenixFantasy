import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { toast } from "react-toastify";
import { PiGenderIntersexBold } from "react-icons/pi";
import { LuPhone } from "react-icons/lu";
import { forwardRef, useId, useState, type FC } from "react";

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

const TOTAL_STEPS = 4;

const Register: FC = () => {
  const {
    register,
    handleSubmit,
    trigger,
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
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<number>(1);

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormInputs)[] = [];

    if (step === 1) fieldsToValidate = ["email", "username"];
    if (step === 2) fieldsToValidate = ["name", "surname"];
    if (step === 3) fieldsToValidate = ["password", "confirmPassword"];
    if (step === 4) fieldsToValidate = ["birthDate", "gender", "phoneNumber"];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) setStep((prev) => prev + 1);
  };

  const stepVariants: Variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleSwipe = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -100 && step < TOTAL_STEPS) {
      let fieldsToValidate: (keyof FormInputs)[] = [];

      if (step === 1) fieldsToValidate = ["email", "username"];
      if (step === 2) fieldsToValidate = ["name", "surname"];
      if (step === 3) fieldsToValidate = ["password", "confirmPassword"];
      if (step === 4) fieldsToValidate = ["birthDate", "gender", "phoneNumber"];

      const isValid = await trigger(fieldsToValidate);

      if (isValid) setStep((prev) => prev + 1);
    }

    if (info.offset.x > 100 && step > 1) {
      setStep((prev) => prev - 1);
    }
  };

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
    <div className="w-screen h-screen relative bg-court bg-no-repeat bg-cover bg-center max-sm:h-svh max-sm:w-svw transition-all duration-1000">
      <div className="absolute inset-0 bg-black/40"></div>
      <AnimatePresence mode="wait">
        <motion.div
          className="relative flex justify-center items-center h-full w-full"
          variants={ballVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="w-screen h-screen relative bg-center bg-basketballBall bg-no-repeat flex justify-center items-center bg-contain max-sm:bg-cover max-sm:bg-center max-sm:w-100 max-sm:h-125">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md px-7 py-2 bg-black/50 rounded-2xl max-sm:rounded-[100px] max-sm:m-5"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (step < TOTAL_STEPS) {
                    nextStep();
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }
              }}
            >
              <h2 className="text-3xl font-bold text-center text-phoenix">
                Register
              </h2>
              <ul className="steps w-full mb-3 pt-3 transition-all duration-300">
                <li
                  className={`step ${
                    step >= 1 &&
                    `after:bg-phoenix before:bg-phoenix text-phoenix  before:border-none after:border-none  ${
                      step == 1 ? "animate-pulse" : ""
                    }`
                  }`}
                  data-content="👤"
                ></li>
                <li
                  className={`step ${
                    step >= 2 &&
                    `after:bg-phoenix before:bg-phoenix text-phoenix  before:border-none after:border-none  ${
                      step == 2 ? "animate-pulse" : ""
                    }`
                  }`}
                  data-content="📝"
                ></li>
                <li
                  className={`step ${
                    step >= 3 &&
                    `after:bg-phoenix before:bg-phoenix text-phoenix  before:border-none after:border-none  ${
                      step == 3 ? "animate-pulse" : ""
                    }`
                  }`}
                  data-content="🔒"
                ></li>
                <li
                  className={`step ${
                    step >= 4 &&
                    `after:bg-phoenix before:bg-phoenix text-phoenix  before:border-none after:border-none  ${
                      step == 4 ? "animate-pulse" : ""
                    }`
                  }`}
                  data-content="📱"
                ></li>
              </ul>
              <p className="text-center text-xs text-white/60 mt-2">
                Swipe left or right
              </p>
              <AnimatePresence>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleSwipe}
                    className="touch-pan-x"
                  >
                    <TextField
                      type="email"
                      label="Email Address"
                      error={emailError}
                      icon={IoMailOutline}
                      placeholder="someone@example.com"
                      {...register("email")}
                    />

                    <TextField
                      label="Username"
                      error={usernameError}
                      icon={CgProfile}
                      placeholder="Username"
                      {...register("username")}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleSwipe}
                    className="touch-pan-x"
                  >
                    <div className="flex gap-3 flex-col">
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
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleSwipe}
                    className="touch-pan-x"
                  >
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
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleSwipe}
                    className="touch-pan-x"
                  >
                    <div className="mb-3">
                      <label className="block text-white text-sm font-semibold ">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        color="white"
                        {...register("birthDate", { valueAsDate: true })}
                        className={`w-full bg-transparent rounded-md px-3 py-[0.4rem] border-white hover:border-phoenix focus:border-phoenix border-2 text-white `}
                      />
                      {birthDateError && (
                        <p className="font-semibold text-error">
                          {birthDateError}
                        </p>
                      )}
                    </div>

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
                  </motion.div>
                )}
                <div className="flex justify-between mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="btn bg-gray-600/80 hover:bg-gray-600 hover:border-gray-600 border-gray-600 hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                      onClick={() => setStep((prev) => prev - 1)}
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < TOTAL_STEPS ? (
                    <button
                      type="button"
                      className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                      key="next-button"
                      onClick={nextStep}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow rounded-xl text-xl"
                      key="register-button"
                    >
                      Register
                    </button>
                  )}
                </div>
                <p className="my-4 text-center text-white" key="signin-text">
                  Already have an account?{"  "}
                  <span
                    className="font-bold text-phoenix cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Sign in instead
                  </span>
                </p>
              </AnimatePresence>
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
