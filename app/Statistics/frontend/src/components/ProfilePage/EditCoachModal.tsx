import type { Coach } from "../../models/Coach";
import { updateCoach } from "../../services/CoachService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.string().min(1, "Birth date is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditCoachModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  coach: Coach;
}

const EditCoachModal: FC<EditCoachModalProps> = ({
  isOpen,
  setIsOpen,
  coach,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: coach
      ? {
          id: coach.id,
          firstName: coach.firstName,
          lastName: coach.lastName,
          dateOfBirth: coach.dateOfBirth.split("T")[0],
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      updateCoach({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Coach updated successfully!");
      setIsOpen(false);
    },
    onError: () => toast.error("Update failed"),
  });

  return (
    <>
      <dialog open={isOpen} className="modal">
        <div className="modal-box bg-white dark:bg-neutral-800">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-white hover:text-black dark:bg-neutral-800 dark:hover:text-white dark:hover:border-white"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-phoenix text-center mb-6">
            Edit Coach
          </h3>

          <form
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium">First Name</label>
                <input
                  {...register("firstName")}
                  className="input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="label-text font-medium">Last Name</label>
                <input
                  {...register("lastName")}
                  className="input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="label-text font-medium">Birth Date</label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white"
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-xs">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            <div className="modal-action flex justify-between gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white border-none"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditCoachModal;
