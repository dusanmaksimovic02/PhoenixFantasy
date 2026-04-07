import { useState, type FC } from "react";
import z from "zod";
import type { User } from "../../models/User";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Team } from "../../models/Team";
import { getTeams } from "../../services/TeamService";
import { getReferees } from "../../services/RefereeService";
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
    round: z.number("Round is required"),
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
      round: 0,
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
        data.round
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
      <h3 className="mb-8 text-center text-phoenix">Add New Game</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Home Team</label>

            <select
              className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white${errors.homeTeam ? "select-error" : ""}`}
            >
              <option value="">Select Home Team</option>
              {teams.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  selected={homeTeam?.id === t.id}
                  onClick={() => {
                    setHomeTeam(t);
                    (document.activeElement as HTMLElement)?.blur();
                    setValue("homeTeam", t);
                  }}
                >
                  {t.name}
                </option>
              ))}
            </select>
            {errors.homeTeam && (
              <p className="text-red-500 text-sm mt-1">
                {errors.homeTeam.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Away Team</label>

            <select
              className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white${
                errors.awayTeam ? "select-error" : ""
              }`}
            >
              <option value="">Select Away Team</option>
              {teams.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  selected={awayTeam?.id === t.id}
                  onClick={() => {
                    setAwayTeam(t);
                    (document.activeElement as HTMLElement)?.blur();
                    setValue("awayTeam", t);
                  }}
                >
                  {t.name}
                </option>
              ))}
            </select>
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
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
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
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
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
              className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${errors.venue ? "border-red-500" : "border-neutral-300"}`}
              placeholder="Venue"
            />
            {errors.venue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.venue.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Referee</label>

            <select
              className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white${
                errors.referee ? "select-error" : ""
              }`}
            >
              <option value="">Select Referee</option>
              {referees.map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  selected={referee?.id === r.id}
                  onClick={() => {
                    setReferee(r);
                    (document.activeElement as HTMLElement)?.blur();
                    setValue("referee", r);
                  }}
                >
                  {r.firstName} {r.lastName}
                </option>
              ))}
            </select>
            {errors.referee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.referee.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Round</label>
          <input
            type="number"
            {...register("round", { valueAsNumber: true })}
            className={`input input-bordered w-full bg-neutral-300 dark:bg-neutral-700 focus:outline-black dark:focus:outline-white ${
              errors.time ? "border-red-500" : "border-neutral-300"
            }`}
          />
          {errors.round && (
            <p className="text-red-500 text-sm">{errors.round.message}</p>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={addGameMutation.isPending}
            className="px-10 py-3 rounded text-white font-semibold
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
