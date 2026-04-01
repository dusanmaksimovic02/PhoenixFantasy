import type { Player } from "../../models/Player";
import { updatePlayer } from "../../services/PlayerService";
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
  jerseyNumber: z
    .string()
    .regex(/^(0|[1-9][0-9]?|00)$/, "Jersey number must be between 00 and 99"),
  position: z.enum(
    [
      "Point Guard",
      "Shooting Guard",
      "Small Forward",
      "Power Forward",
      "Center",
    ],
    {
      message:
        "Position must be one of: Point Guard, Shooting Guard, Small Forward, Power Forward, Center",
    },
  ),
});

type FormData = z.infer<typeof formSchema>;

interface EditPlayerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  player: Player;
}

const EditPlayerModal: FC<EditPlayerModalProps> = ({
  isOpen,
  setIsOpen,
  player,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: player
      ? {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          position: player.position,
          dateOfBirth: player.dateOfBirth.split("T")[0],
          jerseyNumber: player.jerseyNumber.toString(),
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      updatePlayer({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player updated successfully!");
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
            Edit Player
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Position</label>
                <select
                  {...register("position")}
                  className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white${
                    errors.position ? "select-error" : ""
                  }`}
                >
                  <option value="">Select Position</option>
                  <option value="Point Guard">Point Guard</option>
                  <option value="Shooting Guard">Shooting Guard</option>
                  <option value="Small Forward">Small Forward</option>
                  <option value="Power Forward">Power Forward</option>
                  <option value="Center">Center</option>
                </select>
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.position.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="label-text font-medium">Jersey Number</label>
                <input
                  {...register("jerseyNumber")}
                  className="input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white"
                  placeholder="0-99"
                />
                {errors.jerseyNumber && (
                  <span className="text-red-500 text-xs">
                    {errors.jerseyNumber.message}
                  </span>
                )}
              </div>
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
                disabled={!isDirty || updateMutation.isPending}
                className="btn bg-green-600 hover:bg-green-700 text-white border-white"
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

export default EditPlayerModal;
