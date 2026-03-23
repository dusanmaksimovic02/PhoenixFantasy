import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Team } from "../../models/Team";
import type { User } from "../../models/User";
import { useEffect, type FC } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTeams } from "../../services/TeamService";
import { getReferees } from "../../services/RefereeService";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import { getGameById, updateGame } from "../../services/GameService";
import Loading from "../Loading";

interface EditGameModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  gameId: string;
}

const formSchema = z
  .object({
    homeTeam: z.custom<Team>((v) => v !== undefined, {
      message: "Home team is required",
    }),
    awayTeam: z.custom<Team>((v) => v !== undefined, {
      message: "Away team is required",
    }),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    venue: z.string().min(1, "Venue is required"),
    referee: z.custom<User>((v) => v !== undefined, {
      message: "Referee is required",
    }),
  })
  .refine((data) => data.homeTeam?.id !== data.awayTeam?.id, {
    message: "Home and Away teams must be different",
    path: ["awayTeam"],
  });

type FormData = z.infer<typeof formSchema>;

const EditGameModal: FC<EditGameModalProps> = ({
  isOpen,
  setIsOpen,
  gameId,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeTeam: undefined,
      awayTeam: undefined,
      date: "",
      time: "",
      venue: "",
      referee: undefined,
    },
    mode: "onChange",
  });

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameById(gameId),
    enabled: !!gameId && isOpen,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const { data: referees = [] } = useQuery({
    queryKey: ["referees"],
    queryFn: getReferees,
  });

  const updateGameMutation = useMutation({
    mutationFn: (data: FormData) =>
      updateGame({
        id: gameId,
        homeTeam: data.homeTeam,
        guestTeam: data.awayTeam,
        dateTime: `${data.date}T${data.time}:00Z`,
        venue: data.venue,
        referee: data.referee,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      toast.success("Game updated successfully!");
      reset();
      setIsOpen(false);
    },
    onError: () => toast.error("Error updating game"),
  });

  const onSubmit = (data: FormData) => {
    const fullDateTime = `${data.date}T${data.time}:00Z`;
    updateGameMutation.mutate({ ...data, date: fullDateTime });
  };

  useEffect(() => {
    if (!game || teams.length === 0 || referees.length === 0) return;

    const home = teams.find((t) => t.id === game.homeTeam?.id);
    const away = teams.find((t) => t.id === game.guestTeam?.id);
    const ref = referees.find((r) => r.id === game.referee?.id);

    reset({
      homeTeam: home ?? undefined,
      awayTeam: away ?? undefined,
      date: game.dateTime.split("T")[0],
      time: game.dateTime.split("T")[1].substring(0, 5),
      venue: game.venue,
      referee: ref ?? undefined,
    });
  }, [game, teams, referees, reset]);

  if (isLoading) return <Loading />;
  if (!game) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-white dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-phoenix text-center mb-6">
          Edit Game
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Home Team</label>
              <Controller
                control={control}
                name="homeTeam"
                render={({ field }) => (
                  <div className="dropdown w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                    >
                      {field.value ? `${field.value.name}` : "Select a team"}
                      <IoIosArrowDown />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                    >
                      {teams.map((t) => (
                        <li
                          key={t.id}
                          onClick={() => {
                            field.onChange(t);
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          <a>{t.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              />
              {errors.homeTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.homeTeam.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Away Team</label>
              <Controller
                control={control}
                name="awayTeam"
                render={({ field }) => (
                  <div className="dropdown w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                    >
                      {field.value ? `${field.value.name}` : "Select a team"}{" "}
                      <IoIosArrowDown />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                    >
                      {teams.map((t) => (
                        <li
                          key={t.id}
                          onClick={() => {
                            field.onChange(t);
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          <a>{t.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              />
              {errors.awayTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.awayTeam.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                {...register("date")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.date ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Time</label>
              <input
                type="time"
                {...register("time")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.time ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Venue</label>
              <input
                type="text"
                {...register("venue")}
                className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border ${
                  errors.venue ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.venue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.venue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Referee</label>
              <Controller
                control={control}
                name="referee"
                render={({ field }) => (
                  <div className="dropdown w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                    >
                      {field.value
                        ? `${field.value.firstName} ${field.value.lastName}`
                        : "Select a referee"}{" "}
                      <IoIosArrowDown />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
                    >
                      {referees.map((r) => (
                        <li
                          key={r.id}
                          onClick={() => {
                            field.onChange(r);
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          <a>
                            {r.firstName} {r.lastName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              />
              {errors.referee && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.referee.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={!isDirty || updateGameMutation.isPending}
              className="px-10 py-3 rounded-xl text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
            >
              {updateGameMutation.isPending
                ? "Updating Game..."
                : "Update Game"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditGameModal;
