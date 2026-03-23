import type { Player } from "../../models/Player";
import { type FC } from "react";
import { toast } from "react-toastify";
import { addTeam } from "../../services/TeamService";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { getPlayers } from "../../services/PlayerService";
import { getCoaches } from "../../services/CoachService";
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
  // coach: z
  //   .object({
  //     id: z.string(),
  //     firstName: z.string(),
  //     lastName: z.string(),
  //     dateOfBirth: z.string().nullable().optional(),
  //   })
  //   .optional()
  //   .refine((val) => val !== undefined, {
  //     message: "Coach is required",
  //     path: ["coach"],
  //   }),
  // players: z.array(
  //   z.object({
  //     id: z.string(),
  //     firstName: z.string(),
  //     lastName: z.string(),
  //     dateOfBirth: z.string(),
  //     jerseyNumber: z.string(),
  //   }),
  // ),
  players: z.array(z.custom<Player>()).min(1, "Select at least one player"),
});

type FormData = z.infer<typeof formSchema>;

const AddTeam: FC = () => {
  const queryClient = useQueryClient();

  const { data: coaches = [] } = useQuery({
    queryKey: ["coaches"],
    queryFn: getCoaches,
  });
  const { data: players = [] } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
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

  const selectedCoach =
    useWatch({
      control,
      name: "coach",
    }) ?? undefined;

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
    <div className="w-full max-w-2xl rounded-2xl p-8 px-14 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Team</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Team name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Team coach</label>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
            >
              {selectedCoach
                ? `${selectedCoach.firstName} ${selectedCoach.lastName}`
                : "Select a coach"}{" "}
              <IoIosArrowDown />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
            >
              {coaches.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setValue("coach", c, { shouldValidate: true });
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                >
                  <a>
                    {c.firstName} {c.lastName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.coach && (
            <p className="text-red-500 text-sm mt-1">{errors.coach.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Team players</label>
          <div className="dropdown w-full cursor-pointer">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
            >
              Select players ({selectedPlayers.length}) <IoIosArrowDown />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
            >
              <table className="table table-sm">
                <thead>
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
            </div>
          </div>
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
            className="px-10 py-3 rounded-xl text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Add team"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;
