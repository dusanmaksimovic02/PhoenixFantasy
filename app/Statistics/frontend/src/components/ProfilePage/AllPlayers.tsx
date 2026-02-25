import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Loading from "../Loading";
import {
  deletePlayer,
  getPlayers,
  updatePlayer,
} from "../../services/PlayerService";
import type { Player } from "../../models/Player";

const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Surname is required"),
  dateOfBirth: z.string().min(1, "Birth date is required"),
  jerseyNumber: z
    .string()
    .regex(/^(0|[1-9][0-9]?|00)$/, "Jersey number must be between 00 and 99"),
});

type FormData = z.infer<typeof formSchema>;

const AllPlayers: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
      setIsOpenEdit(false);
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted successfully");
      setIsOpenDelete(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  const openEditModal = (player: Player) => {
    reset({
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      dateOfBirth: player.dateOfBirth.split("T")[0],
      jerseyNumber: player.jerseyNumber.toString(),
    });
    setIsOpenEdit(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full relative p-4">
      <h3 className="text-center text-2xl font-bold mb-6">All Players</h3>

      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 dark:bg-neutral-900">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birth Date</th>
              <th>JN</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player: Player) => (
              <tr
                key={player.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <td className="text-xs">{player.id}</td>
                <td>{player.firstName}</td>
                <td>{player.lastName}</td>
                <td>{player.dateOfBirth.split("T")[0]}</td>
                <td>
                  <span className="badge badge-ghost font-bold">
                    {player.jerseyNumber}
                  </span>
                </td>
                <td>
                  <div className="flex justify-center gap-4">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => openEditModal(player)}
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setSelectedId(player.id);
                        setIsOpenDelete(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog open={isOpenDelete} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Delete Player?</h3>
          <p className="py-4 text-center">This action cannot be undone.</p>
          <div className="modal-action flex justify-around">
            <button
              className="btn btn-outline"
              onClick={() => setIsOpenDelete(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-error text-white"
              onClick={() => deleteMutation.mutate(selectedId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </dialog>

      <dialog open={isOpenEdit} className="modal">
        <div className="modal-box bg-white dark:bg-neutral-800">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsOpenEdit(false)}
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
            <div>
              <label className="label-text font-medium">First Name</label>
              <input
                {...register("firstName")}
                className="input input-bordered w-full"
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
                className="input input-bordered w-full"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text font-medium">Birth Date</label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
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
                onClick={() => setIsOpenEdit(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {deleteMutation.isPending && <Loading />}
    </div>
  );
};

export default AllPlayers;
