import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CgProfile } from "react-icons/cg";
import { CiLock } from "react-icons/ci";
import {  useNavigate } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  forwardRef,
  useId,
  type ElementType,
  type FC,
  type InputHTMLAttributes,
} from "react";

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
  icon: ElementType;
  type?: string;
} & InputHTMLAttributes<HTMLInputElement>;

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
              border-white focus:border-phoenix focus:outline-phoenix focus:border-0 focus:my-2 rounded-md
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

const Login: FC = () => {
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
    <div className="w-full h-full relative bg-court  bg-no-repeat bg-cover bg-center max-sm:h-svh max-sm:w-svw">
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
              className="w-full max-w-md p-7 bg-black/50 rounded-2xl  max-sm:rounded-[70px] max-sm:my-2 max-sm:mx-8"
            >
              <h1 className="text-3xl font-bold text-center text-phoenix">
                Login
              </h1>
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
              <button
                type="submit"
                className="w-full bg-phoenix hover:border-phoenix cursor-pointer hover:bg-phoenix/80 hover:border-2  p-2 rounded-md font-bold"
              >
                Login
              </button>
              <p className="my-4 text-center text-white ">
                Don't have an account?{"  "}
                <span
                  className="font-bold text-phoenix cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Create an account
                </span>
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

export default Login;
