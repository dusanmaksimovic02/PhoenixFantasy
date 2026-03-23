import { useState, type FC } from "react";
import z from "zod";
import type { User } from "../../models/User";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Team } from "../../models/Team";
import { getTeams } from "../../services/TeamService";
import { getReferees } from "../../services/RefereeService";
import { IoIosArrowDown } from "react-icons/io";
import { addGame } from "../../services/GameService";
import { toast } from "react-toastify";

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

const AddGame: FC = () => {
  const queryClient = useQueryClient();
  const [homeTeam, setHomeTeam] = useState<Team | undefined>(undefined);
  const [awayTeam, setAwayTeam] = useState<Team | undefined>(undefined);
  const [referee, setReferee] = useState<User | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
  const { data: referees = [] } = useQuery({
    queryKey: ["referees"],
    queryFn: getReferees,
  });

  const addGameMutation = useMutation({
    mutationFn: (data: FormData) =>
      addGame(
        data.homeTeam!.id,
        data.awayTeam!.id,
        data.date,
        data.venue,
        data.referee!.id,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Game created successfully!");
      reset();
    },
    onError: () => toast.error("Error creating game"),
  });

  const onSubmit = (data: FormData) => {
    const fullDateTime = `${data.date}T${data.time}:00Z`;
    addGameMutation.mutate({ ...data, date: fullDateTime });
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl p-8 px-13 shadow-lg bg-neutral-100 dark:bg-neutral-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Add new Game</h1>
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
                {homeTeam ? `${homeTeam.name}` : "Select a team"}{" "}
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
                      setHomeTeam(t);
                      (document.activeElement as HTMLElement)?.blur();
                      setValue("homeTeam", t);
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
                      setAwayTeam(t);
                      (document.activeElement as HTMLElement)?.blur();
                      setValue("awayTeam", t);
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
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
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
                      setReferee(r);
                      (document.activeElement as HTMLElement)?.blur();
                      setValue("referee", r);
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
            disabled={addGameMutation.isPending}
            className="px-10 py-3 rounded-xl text-white font-semibold
              bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full md:w-auto"
          >
            {addGameMutation.isPending ? "Creating Game..." : "Add Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
