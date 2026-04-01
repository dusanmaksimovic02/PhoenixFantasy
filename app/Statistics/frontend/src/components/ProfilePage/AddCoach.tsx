import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCoach } from "../../services/CoachService";
import { type FC } from "react";
import { toast } from "react-toastify";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.string().min(1, "Birth date is required"),
});

type FormData = z.infer<typeof formSchema>;

const AddCoach: FC = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa9",
      };
      return addCoach(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach created successfully!");
      reset();
    },
    onError: (error) => {
      toast.error("Error creating coach");
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 px-13 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h3 className="mb-8 text-center text-phoenix">Add Coach</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>

            <input
              {...register("firstName")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
                errors.firstName ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name</label>

            <input
              {...register("lastName")}
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
                errors.lastName ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Birth Date</label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
              errors.dateOfBirth ? "border-red-500" : "border-neutral-300"
            }`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-10 py-3 rounded text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50"
          >
            {mutation.isPending ? "Adding..." : "Add Coach"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoach;
