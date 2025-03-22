import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PiGenderIntersexBold } from "react-icons/pi";
import { LuPhone } from "react-icons/lu";

const ballVariants = {
  initial: { scale: 0, y: 200, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0, y: 200, opacity: 1 },
  transition: { type: "spring", stiffness: 80, damping: 10 },
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

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon: Icon, type = "text", ...props }, ref) => {
    const id = React.useId();

    return (
      <Typography
        as="label"
        htmlFor={id}
        color="default"
        className="block mb-3 text-white"
      >
        <span className="text-sm font-semibold">{label}</span>
        <Input
          ref={ref}
          {...props}
          id={id}
          type={type}
          size="md"
          isError={Boolean(error)}
          color={error ? "error" : "primary"}
          className="border-white hover:border-phoenix focus:border-phoenix border-2 text-white"
        >
          <Input.Icon>
            <Icon className="h-full w-full text-white" />
          </Input.Icon>
        </Input>
        {error && (
          <Typography type="p" color="error" className="font-semibold">
            {error}
          </Typography>
        )}
      </Typography>
    );
  }
);

const Register = () => {
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
    <div className="w-screen h-screen relative bg-court bg-no-repeat bg-cover max-sm:h-svh max-sm:w-svw ">
      <motion.div
        className="relative flex justify-center items-center h-full w-full"
        variants={ballVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="w-screen h-screen relative bg-center bg-basketballBall bg-no-repeat flex justify-center items-center bg-contain max-sm:bg-cover max-sm:bg-center max-sm:w-[450px] max-sm:h-[650px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md px-7 py-2 bg-black bg-opacity-50 rounded-[90px] max-sm:m-5"
          >
            <Typography
              type="h2"
              className="text-3xl font-bold text-center text-phoenix"
            >
              Register
            </Typography>
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
                  <Typography type="p" color="error" className="font-semibold">
                    {birthDateError}
                  </Typography>
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
            <div className="flex justify-end gap-2">
              <Checkbox
                id="default-checkbox"
                onChange={() => setShowPassword((prev) => !prev)}
                checked={showPassword}
                className="checked:!bg-phoenix border-white"
                color="warning"
              >
                <Checkbox.Indicator />
              </Checkbox>
              <Typography
                as="label"
                htmlFor="default-checkbox"
                className="cursor-pointer text-white"
              >
                Show Password
              </Typography>
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
            <Button
              type="submit"
              className="w-full bg-phoenix border-phoenix hover:bg-opacity-90 hover:border-phoenix hover:bg-phoenix"
            >
              Register
            </Button>
            <Typography
              type="small"
              className="my-4 flex items-center justify-center gap-1 text-white"
            >
              Already have an account?
              <Link className="font-bold text-phoenix" to={"/login"}>
                Click here
              </Link>
            </Typography>
          </form>
        </div>
        <Button
          className=" bg-transparent hover:bg-transparent border-white hover:border-white absolute right-5 bottom-5"
          onClick={() => {
            navigate("/");
          }}
        >
          Go home
        </Button>
      </motion.div>
    </div>
  );
};

export default Register;
