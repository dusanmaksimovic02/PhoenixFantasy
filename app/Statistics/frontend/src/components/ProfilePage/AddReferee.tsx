import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUserWithRole } from "../../services/AuthService";
import { type FC } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
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
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number"),
});

type FormData = z.infer<typeof formSchema>;

const AddReferee: FC = () => {
  const queryClient = useQueryClient();

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
      surname: "",
      birthDate: "",
      phoneNumber: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      registerUserWithRole({
        userName: data.username,
        email: data.email,
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        id: "",
        role: "Referee",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referees"] });
      toast.success("Referee created successfully!");
      reset();
    },
    onError: (err) => {
      toast.error("Error creating referee");
      console.error(err);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h3 className="mb-8 text-center text-phoenix">Add Referee</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...registerField("email")}
            placeholder="example@mail.com"
            className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.email ? "border-red-500" : "border-neutral-300"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              {...registerField("username")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.username ? "border-red-500" : "border-neutral-300"}`}
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...registerField("password")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.password ? "border-red-500" : "border-neutral-300"}`}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              {...registerField("name")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.name ? "border-red-500" : "border-neutral-300"}`}
              placeholder="First Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              {...registerField("surname")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.surname ? "border-red-500" : "border-neutral-300"}`}
              placeholder="Last Name"
            />
            {errors.surname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.surname.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Birth Date</label>
            <input
              type="date"
              {...registerField("birthDate")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.birthDate ? "border-red-500" : "border-neutral-300"}`}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.birthDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              placeholder="+381..."
              {...registerField("phoneNumber")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.phoneNumber ? "border-red-500" : "border-neutral-300"}`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-10 py-3 rounded text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
          >
            {mutation.isPending ? "Adding..." : "Add Referee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReferee;
