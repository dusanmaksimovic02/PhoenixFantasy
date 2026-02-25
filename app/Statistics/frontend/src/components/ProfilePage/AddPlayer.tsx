import { zodResolver } from "@hookform/resolvers/zod";
import { addPlayer } from "../../services/PlayerService";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.string().min(1, "Birth date is required"),
  jerseyNumber: z
    .string()
    .regex(/^(0|[1-9][0-9]?|00)$/, "Jersey number must be between 00 and 99")
    .min(1, "Jersey number is required"),
});

type FormData = z.infer<typeof formSchema>;

const AddPlayer: FC = () => {
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
      jerseyNumber: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
      };
      return addPlayer(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player created successfully!");
      reset();
    },
    onError: (err) => {
      toast.error("Error creating player");
      console.error(err);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 px-13 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Player</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              {...register("firstName")}
              className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                errors.firstName ? "border-red-500" : "border-neutral-300"
              }`}
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
              className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                errors.lastName ? "border-red-500" : "border-neutral-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Birth Date</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                errors.dateOfBirth ? "border-red-500" : "border-neutral-300"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Jersey Number</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              {...register("jerseyNumber", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              })}
              className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                errors.jerseyNumber ? "border-red-500" : "border-neutral-300"
              }`}
            />
            {errors.jerseyNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jerseyNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-10 py-3 rounded-xl text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
          >
            {mutation.isPending ? "Creating..." : "Add Player"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayer;
