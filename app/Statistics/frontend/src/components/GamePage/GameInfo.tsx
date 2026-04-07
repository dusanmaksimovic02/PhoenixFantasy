import { useRef, useState, type FC } from "react";
import PlusMinusButtons from "./PlusMinusButtons";
import type { Game } from "../../models/Game";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoachStats,
  addTechnicalToCoach,
  removeTechnicalToCoach,
  endGame,
} from "../../services/LiveGameService";
import { getTeamCoach } from "../../services/TeamService";
import { getGameById } from "../../services/GameService";
import { toast } from "react-toastify";

interface GameInfoProps {
  game: Game;
}

const GameInfo: FC<GameInfoProps> = (props) => {
  const [isStopped, setIsStopped] = useState<boolean>(true);
  const [time, setTime] = useState<number>(600);
  const [quarter, setQuarter] = useState<number>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queryClient = useQueryClient();

  // const game = {
  //   homeTeam: props.game.homeTeam.name,
  //   homeLogo: `${props.game.homeTeam.logoPathURL}`,
  //   awayTeam: props.game.guestTeam.name,
  //   awayLogo: `${props.game.guestTeam.logoPathURL}`,
  //   date: props.game.dateTime?.split("T")[0] ?? "",
  //   time: props.game.dateTime?.split("T")[1]?.slice(0, 5) ?? "",
  //   arena: props.game.venue,
  //   played: false,
  //   result: {
  //     homeScore: props.game.homeTeamScore,
  //     awayScore: props.game.guestTeamScore,
  //   },
  // };

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", props.game.id],
    queryFn: () => getGameById(props.game.id),
  });

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (intervalRef.current) return;

    setIsStopped(false);

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          stopTimer();

          setQuarter((q) => {
            if (q < 4) {
              return q + 1;
            }
            return q;
          });

          if (quarter == 4) return 0;
          else return 600;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsStopped(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const { data: homeCoach } = useQuery({
    queryKey: ["homeCoach"],
    queryFn: () => getTeamCoach(props.game.homeTeam.id),
  });

  const { data: awayCoach } = useQuery({
    queryKey: ["awayCoach"],
    queryFn: () => getTeamCoach(props.game.guestTeam.id),
  });

  const { data: homeCoachStats } = useQuery({
    queryKey: ["homeCoachStats"],
    queryFn: () => getCoachStats(props.game.id, homeCoach!.id),
  });

  const { data: awayCoachStats } = useQuery({
    queryKey: ["awayCoachStats"],
    queryFn: () => getCoachStats(props.game.id, awayCoach!.id),
  });

  const addTechnicalToCoachMutation = useMutation({
    mutationFn: async (data: { coachId: string; type: string }) =>
      addTechnicalToCoach(props.game.id, data.coachId, data.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeCoachStats"] });
      queryClient.invalidateQueries({ queryKey: ["awayCoachStats"] });
      queryClient.invalidateQueries({ queryKey: ["coachStats"] });
    },
    onError: (e) => {
      console.log("error while adding techs: " + e);
    },
  });

  const removeTechnicalToCoachMutation = useMutation({
    mutationFn: async (data: { coachId: string; type: string }) =>
      removeTechnicalToCoach(props.game.id, data.coachId, data.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeCoachStats"] });
      queryClient.invalidateQueries({ queryKey: ["awayCoachStats"] });
    },
    onError: (e) => {
      console.log("error while removing techs: " + e);
    },
  });

  const endGameMutation = useMutation({
    mutationFn: async () => endGame(props.game.id),
    onSuccess: () => {
      toast.success("Game ended successfully");
      queryClient.invalidateQueries({ queryKey: ["homeCoachStats"] });
      queryClient.invalidateQueries({ queryKey: ["awayCoachStats"] });
    },
  });

  return (
    <div className="pt-7 px-10 ">
      <div className="h-fit w-full max-sm:h-svh flex max-sm:flex-col justify-between items-center gap-5 px-7 py-2 bg-surface-light dark:bg-surface-dark rounded-4xl max-sm:justify-around">
        <div className="w-full flex flex-1 max-sm:flex-col justify-between items-center gap-5 rounded-3xl ">
          <div className="flex flex-col flex-3">
            <div className="flex pb-5 items-center gap-10 text-center">
              <img
                src={`${props.game.homeTeam.logoPathURL}`}
                alt={`${props.game.homeTeam.logoPathURL} logo`}
                className="w-35 h-35"
              />
              <div className="flex flex-col">
                <p className="text-3xl font-extrabold">
                  {props.game.homeTeam.name}
                </p>
                <p
                  className={`text-6xl font-bold ${
                    game
                      ? game.homeTeamScore > game?.guestTeamScore
                        ? "text-phoenix"
                        : ""
                      : ""
                  }`}
                >
                  {isLoading ? 0 : `${game!.homeTeamScore}`}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center pl-3">
              <strong>Coach:</strong>
              <p>
                {homeCoach
                  ? `${homeCoach!.firstName} ${homeCoach?.lastName}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-col justify-around h-full p-3 gap-3">
              <div className="flex gap-5 items-center">
                <div className="flex gap-2">
                  <p>Couch Technical</p>
                  <p>{homeCoachStats?.coachTechnicalFouls}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    addTechnicalToCoachMutation.mutate({
                      coachId: homeCoach!.id,
                      type: "coach",
                    })
                  }
                  onMinusClick={() =>
                    removeTechnicalToCoachMutation.mutate({
                      coachId: homeCoach!.id,
                      type: "coach",
                    })
                  }
                  minusDisable={() =>
                    homeCoachStats?.coachTechnicalFouls == 0 ||
                    removeTechnicalToCoachMutation.isPending
                  }
                  plusDisabled={() => addTechnicalToCoachMutation.isPending}
                />
              </div>
              <div className="flex  gap-5 items-center">
                <div className="flex gap-2">
                  <p>Bench Technical</p>
                  <p>{homeCoachStats?.benchTechnicalFouls}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    addTechnicalToCoachMutation.mutate({
                      coachId: homeCoach!.id,
                      type: "bench",
                    })
                  }
                  onMinusClick={() =>
                    removeTechnicalToCoachMutation.mutate({
                      coachId: homeCoach!.id,
                      type: "bench",
                    })
                  }
                  minusDisable={() =>
                    homeCoachStats?.benchTechnicalFouls == 0 ||
                    removeTechnicalToCoachMutation.isPending
                  }
                  plusDisabled={() => addTechnicalToCoachMutation.isPending}
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-2 flex-col items-center justify-center gap-5 w-fit">
            <div className="text-center">
              <p>{game?.venue}</p>
              <p>{game?.dateTime?.split("T")[0] ?? ""}</p>
              <p>{game?.dateTime?.split("T")[1]?.slice(0, 5) ?? ""}</p>
            </div>
            <div className="w-full flex justify-center gap-5">
              <p
                className={`text-4xl w-fit px-7 border-2 border-black dark:border-white rounded-4xl f font-bold ${
                  isStopped ? "text-red-500" : ""
                }`}
              >
                {formatTime(time)}
              </p>
              <div className="flex flex-col gap-3 mt-2">
                <button
                  className="hover:cursor-pointer"
                  onClick={() => setTime((t) => Math.min(600, t + 1))}
                >
                  <FaAngleUp />
                </button>

                <button
                  className="hover:cursor-pointer"
                  onClick={() => setTime((t) => Math.max(0, t - 1))}
                >
                  <FaAngleDown />
                </button>
              </div>
            </div>
            <p className="text-2xl font-semibold"> {quarter} quarter</p>
            <div className=" flex gap-5">
              <button
                className={`btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl
                    ${
                      isStopped
                        ? "bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600"
                        : ""
                    }`}
                onClick={() => {
                  if (isStopped) {
                    startTimer();
                  } else {
                    stopTimer();
                  }
                }}
              >
                {isStopped ? "start" : "stop"}
              </button>
              <button
                className={`btn text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600`}
                disabled={!(quarter === 4 && time === 0)}
                onClick={() => {
                  endGameMutation.mutate();
                }}
              >
                End Game
              </button>
            </div>
          </div>
          <div className="flex flex-3 flex-col">
            <div className="flex flex-1 pb-5 justify-end items-center gap-10 text-center">
              <div>
                <p className="text-3xl font-extrabold">
                  {props.game.guestTeam.name}
                </p>
                <p
                  className={`text-6xl font-bold ${
                    game
                      ? game!.homeTeamScore < game!.guestTeamScore
                        ? "text-phoenix"
                        : ""
                      : ""
                  }`}
                >
                  {isLoading ? 0 : `${game!.guestTeamScore}`}
                </p>
              </div>
              <img
                src={`${props.game.guestTeam.logoPathURL}`}
                alt="away logo"
                className="w-35 h-35"
              />
            </div>
            <div className="flex gap-3 items-center justify-end pr-34">
              <strong>Coach:</strong>
              <p>
                {awayCoach
                  ? `${awayCoach!.firstName} ${awayCoach?.lastName}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-col justify-around h-full p-3 gap-3">
              <div className="flex justify-end gap-5 items-center ">
                <div className="flex gap-2">
                  <p>Couch Technical</p>
                  <p>{awayCoachStats?.coachTechnicalFouls}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    addTechnicalToCoachMutation.mutate({
                      coachId: awayCoach!.id,
                      type: "coach",
                    })
                  }
                  onMinusClick={() =>
                    removeTechnicalToCoachMutation.mutate({
                      coachId: awayCoach!.id,
                      type: "coach",
                    })
                  }
                  minusDisable={() =>
                    awayCoachStats?.coachTechnicalFouls == 0 ||
                    removeTechnicalToCoachMutation.isPending
                  }
                  plusDisabled={() => addTechnicalToCoachMutation.isPending}
                />
              </div>
              <div className="flex justify-end  gap-5 items-center">
                <div className="flex gap-2">
                  <p>Bench Technical</p>
                  <p>{awayCoachStats?.benchTechnicalFouls}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    addTechnicalToCoachMutation.mutate({
                      coachId: awayCoach!.id,
                      type: "bench",
                    })
                  }
                  onMinusClick={() =>
                    removeTechnicalToCoachMutation.mutate({
                      coachId: awayCoach!.id,
                      type: "bench",
                    })
                  }
                  minusDisable={() =>
                    awayCoachStats?.benchTechnicalFouls == 0 ||
                    removeTechnicalToCoachMutation.isPending
                  }
                  plusDisabled={() => addTechnicalToCoachMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
