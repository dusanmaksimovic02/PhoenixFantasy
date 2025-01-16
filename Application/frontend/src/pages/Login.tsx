import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Typography } from "@material-tailwind/react";
import { CgProfile } from "react-icons/cg";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";

const ballVariants = {
  initial: { scale: 0, y: 200, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0, y: 200, opacity: 1 },
  transition: { type: "spring", stiffness: 80, damping: 10 },
};

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
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
        className="mb-3 block text-white"
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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  function onSubmit(data: FormInputs) {
    console.log(data);
  }

  const nameError = errors.username?.message;
  const passwordError = errors.password?.message;

  return (
    <div className="w-screen h-screen relative bg-court bg-no-repeat bg-cover  max-sm:h-svh max-sm:w-svw ">
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
            className="w-full max-w-md p-7 bg-black bg-opacity-50 rounded-2xl max-sm:rounded-[30px] max-sm:my-2 max-sm:mx-8"
          >
            <Typography
              type="h1"
              className="text-3xl font-bold text-center text-phoenix"
            >
              Login
            </Typography>
            <TextField
              label="Username"
              error={nameError}
              icon={CgProfile}
              placeholder="Username"
              {...register("username")}
            />
            <TextField
              type="password"
              label="Password"
              error={passwordError}
              icon={CiLock}
              placeholder="********"
              {...register("password")}
            />
            <Button
              type="submit"
              className="w-full bg-phoenix border-phoenix hover:bg-opacity-90 hover:border-phoenix hover:bg-phoenix"
            >
              Login
            </Button>
            <Typography
              type="small"
              className="my-4 flex items-center justify-center gap-1 text-white"
            >
              Don't have an account?
              <Link className="font-bold text-phoenix" to={"/register"}>
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

export default Login;
