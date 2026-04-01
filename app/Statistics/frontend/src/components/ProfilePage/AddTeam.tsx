import type { Player } from "../../models/Player";
import { type FC } from "react";
import { toast } from "react-toastify";
import { addTeam } from "../../services/TeamService";
import { IoIosClose } from "react-icons/io";
import { getFreePlayers } from "../../services/PlayerService";
import { getAllFreeCoaches } from "../../services/CoachService";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Coach } from "@/models/Coach";

const formSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  coach: z.custom<Coach>((v) => v !== undefined, {
    message: "Coach is required",
  }),
  players: z.array(z.custom<Player>()).min(1, "Select at least one player"),
});

type FormData = z.infer<typeof formSchema>;

const AddTeam: FC = () => {
  const queryClient = useQueryClient();

  const { data: coaches = [] } = useQuery({
    queryKey: ["freeCoaches"],
    queryFn: getAllFreeCoaches,
  });
  const { data: players = [] } = useQuery({
    queryKey: ["freePlayers"],
    queryFn: getFreePlayers,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", coach: undefined, players: [] },
  });

  const selectedPlayers =
    useWatch({
      control,
      name: "players",
    }) ?? [];

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      addTeam(
        data.name,
        data.coach!.id,
        data.players.map((p) => p.id),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created successfully!");
      reset();
    },
    onError: () => toast.error("Error creating team"),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  const togglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.some((p) => p.id === player.id);
    const newVal = isSelected
      ? selectedPlayers.filter((p) => p.id !== player.id)
      : [...selectedPlayers, player];
    setValue("players", newVal, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-xl rounded-xl p-8 px-14 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h3 className="mb-8 text-center text-phoenix">Add Team</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Team name</label>
          <input
            {...register("name")}
            className="input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white"
            placeholder="Team Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Team coach</label>

          <select
            className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white${
              errors.coach ? "select-error" : ""
            }`}
          >
            <option value="">Select Coach</option>
            {coaches.map((c) => (
              <option
                key={c.id}
                value={c.id}
                onClick={() => {
                  setValue("coach", c, { shouldValidate: true });
                  (document.activeElement as HTMLElement)?.blur();
                }}
              >
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
          {errors.coach && (
            <p className="text-red-500 text-sm mt-1">{errors.coach.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Team players</label>

          <select
            className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white`}
          >
            <option value="">Select players ({selectedPlayers.length}) </option>

            <table className="table table-sm ">
              <thead className="text-neutral-700 dark:text-neutral-50">
                <tr>
                  <th>Name</th>
                  <th>JN</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => togglePlayer(p)}
                    className={`cursor-pointer ${selectedPlayers.some((sp) => sp.id === p.id) ? "bg-phoenix" : ""}`}
                  >
                    <td>
                      {p.firstName} {p.lastName}
                    </td>
                    <td>{p.jerseyNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </select>
          {errors.players && (
            <p className="text-red-500 text-sm mt-1">
              {errors.players.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedPlayers.map((p) => (
            <span
              key={p.id}
              className="flex gap-1 bg-phoenix px-3 py-1 rounded-full text-xs"
            >
              {p.firstName} {p.lastName}
              <IoIosClose
                className="cursor-pointer w-4 h-4"
                onClick={() => togglePlayer(p)}
              />
            </span>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-10 py-3 rounded text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Add Team"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;
