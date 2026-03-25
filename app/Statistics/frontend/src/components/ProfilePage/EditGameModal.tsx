import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Team } from "../../models/Team";
import type { User } from "../../models/User";
import { type FC } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTeams } from "../../services/TeamService";
import { getReferees } from "../../services/RefereeService";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import { updateGame } from "../../services/GameService";
import type { Game } from "../../models/Game";

interface EditGameModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  gameId: string;
  game: Game;
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
  game,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: game
      ? {
          homeTeam: game.homeTeam,
          awayTeam: game.guestTeam,
          referee: game.referee,
          venue: game.venue,
          date: game.dateTime?.split("T")[0] ?? "",
          time: game.dateTime?.split("T")[1]?.slice(0, 5) ?? "",
        }
      : undefined,
  });

  const homeTeam = watch("homeTeam");
  const awayTeam = watch("awayTeam");
  const referee = watch("referee");

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
        gameId: gameId,
        homeTeamId: data.homeTeam.id,
        guestTeamId: data.awayTeam.id,
        dateTime: `${data.date}T${data.time}:00Z`,
        venue: data.venue,
        refereeId: data.referee.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      toast.success("Game updated successfully!");
      reset();
      setIsOpen(false);
    },
    onError: (e) => {
      toast.error("Error updating game");
      console.log(e);
    },
  });

  const onSubmit = (data: FormData) => {
    updateGameMutation.mutate(data);
  };

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
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {homeTeam ? `${homeTeam.name}` : "Select a team"}
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
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("homeTeam", t, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>{t.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.homeTeam && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.homeTeam.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Away Team</label>
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {awayTeam ? `${awayTeam.name}` : "Select a team"}{" "}
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
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("awayTeam", t, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>{t.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
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
              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
                >
                  {referee
                    ? `${referee.firstName} ${referee.lastName}`
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
                        (document.activeElement as HTMLElement)?.blur();
                        setValue("referee", r, {
                          // shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <a>
                        {r.firstName} {r.lastName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
              className="px-10 py-3 rounded-xl text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto disabled:cursor-auto"
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
