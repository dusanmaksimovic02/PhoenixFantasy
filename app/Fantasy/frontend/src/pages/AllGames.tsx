
import type { Game } from "../models/Game";
import { getGamesByRound } from "../services/StatsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import type { GamesRound } from "../models/GamesRound";
import Loading from "../components/Loading";
import * as signalR from "@microsoft/signalr";

const FANTASY_API_URL = "https://localhost:7035";

type LiveScore = {
  homeTeamScore: number;
  guestTeamScore: number;
};

type GameState = "SCHEDULED" | "LIVE" | "FINISHED";

const AllGames: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const [liveStatuses, setLiveStatuses] = useState<Record<string, GameState>>({});

  const queryClient = useQueryClient();

  const { data: gamesByRound, isLoading } = useQuery({
    queryKey: ["gamesByRound"],
    queryFn: getGamesByRound,
  });

  const navigate = useNavigate();

  const handleClick = (game: Game) => {
    const team1 = game.homeTeam.name.replace(/\s+/g, "-");
    const team2 = game.guestTeam.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`, {
      state: { gameId: game.id },
    });
  };

  const scrollToRound = (round: string) => {
    const element = document.getElementById(round);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!gamesByRound) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${FANTASY_API_URL}/gameScoreHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("GameStarted", (data) => {
      console.log("[SignalR] GameStarted:", data);
      setLiveStatuses((prev) => ({
        ...prev,
        [data.gameId]: "LIVE",
      }));
    });

    connection.on("GameScoreUpdated", (data) => {
      console.log("[SignalR] Score:", data);

      setLiveScores((prev) => ({
        ...prev,
        [data.gameId]: {
          homeTeamScore: data.homeTeamScore,
          guestTeamScore: data.guestTeamScore,
        },
      }));

      setLiveStatuses((prev) =>
        prev[data.gameId] === "FINISHED"
          ? prev
          : { ...prev, [data.gameId]: "LIVE" },
      );
    });

    connection.on("GameEnded", (data) => {
      console.log("[SignalR] GameEnded:", data);

      setLiveStatuses((prev) => ({
        ...prev,
        [data.gameId]: "FINISHED",
      }));

      setLiveScores((prev) => ({
        ...prev,
        [data.gameId]: {
          homeTeamScore: data.homeTeamScore,
          guestTeamScore: data.guestTeamScore,
        },
      }));

      queryClient.invalidateQueries({ queryKey: ["gamesByRound"] });
    });

    connection
      .start()
      .then(async () => {
        console.log("[SignalR] Connected");

        for (const round of gamesByRound) {
          await connection.invoke("JoinRound", round.round.toString());

          for (const game of round.games) {
            await connection.invoke("JoinTeam", game.homeTeam.id);
            await connection.invoke("JoinTeam", game.guestTeam.id);
          }
        }

        console.log("[SignalR] Joined all groups");
      })
      .catch((err) => console.error("SignalR error:", err));

    return () => {
      connection.stop();
    };
  }, [gamesByRound, queryClient]);

  return (
    <div className="pt-16 min-h-screen w-screen font-palanquin ">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="p-5 flex items-center justify-between">
            <h1 className="text-center pl-40 text-3xl font-bold w-[90%] ">
              All <span className="text-phoenix">Games</span> by{" "}
              <span className="text-phoenix">Rounds</span>
            </h1>

            <div className="dropdown">
              <label
                onFocus={() => setIsOpen(false)}
                onBlur={() => setIsOpen(true)}
                tabIndex={0}
                className="btn bg-phoenix/80 border-phoenix hover:bg-phoenix w-fit gap-1 whitespace-nowrap text-white flex items-center"
              >
                <span className="text-lg font-medium">Go to round</span>
                <IoIosArrowDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? `rotate-0` : `rotate-180`
                  }`}
                />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow rounded-box w-38 bg-surface-light dark:bg-surface-dark/70 "
              >
                {gamesByRound?.map((gr: GamesRound) => (
                  <li key={`round-${gr.round}`}>
                    <button
                      className=" text-lg font-medium w-full text-center hover:bg-surface"
                      onClick={() => {
                        scrollToRound(`round-${gr.round}`);
                        setIsOpen(true);
                        (document.activeElement as HTMLElement)?.blur();
                      }}
                    >
                      Round {gr.round}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {gamesByRound?.map((gr: GamesRound) => (
            <div
              key={`round-${gr.round}`}
              id={`round-${gr.round}`}
              className="pt-16"
            >
              <h2 className="text-phoenix text-3xl font-bold text-center my-5">
                Round {gr.round}
              </h2>

              <div className="flex flex-col gap-5 m-5">
                {gr.games.map((game: Game) => {
                  const liveScore = liveScores[game.id];

                  const homeScore =
                    liveScore?.homeTeamScore ?? game.homeTeamScore ?? 0;
                  const guestScore =
                    liveScore?.guestTeamScore ?? game.guestTeamScore ?? 0;

                  let status: GameState;

                  if (game.gameEnded) {
                    status = "FINISHED";
                  } else if (liveStatuses[game.id]) {
                    status = liveStatuses[game.id];
                  } else if (homeScore > 0 || guestScore > 0) {
                    status = "LIVE";
                  } else {
                    status = "SCHEDULED";
                  }

                  const homeWin = homeScore > guestScore;
                  const guestWin = guestScore > homeScore;

                  return (
                    <div
                      key={game.id}
                      className={`flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl cursor-pointer
                      ${status === "LIVE" ? "ring-2 ring-red-500/50" : ""}`}
                      onClick={() => handleClick(game)}
                    >
                      <div className="flex w-[40%] flex-col gap-3">
                        <img
                          src={game.homeTeam?.logoPathURL}
                          className="w-36 h-36"
                        />
                        <p className="text-2xl text-phoenix font-extrabold">
                          {game.homeTeam.name}
                        </p>
                      </div>

                      <div className="flex w-[20%] flex-col gap-5 items-center">
                        {status !== "SCHEDULED" ? (
                          <div className="flex text-5xl">
                            <div
                              className={`border-2 border-black dark:border-white p-5 rounded-l-2xl
                              ${homeWin ? "bg-green-500" : "bg-red-500"}`}
                            >
                              {homeScore}
                            </div>
                            <div
                              className={`border-2 border-black dark:border-white p-5 rounded-r-2xl
                              ${guestWin ? "bg-green-500" : "bg-red-500"}`}
                            >
                              {guestScore}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p>{game.dateTime?.split("T")[0]}</p>
                            <p>{game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
                            <p>{game.venue}</p>
                          </div>
                        )}

                        <div>
                          {status === "FINISHED" && (
                            <span className="bg-gray-700 text-white px-5 py-2 rounded-full">
                              ✅ Finished — Round {game.round}
                            </span>
                          )}
                          {status === "LIVE" && (
                            <span className="bg-red-600 text-white px-5 py-2 rounded-full animate-pulse">
                              🔴 LIVE
                            </span>
                          )}
                          {status === "SCHEDULED" && (
                            <span className="bg-yellow-500 text-black px-5 py-2 rounded-full">
                              🕒 Scheduled — Round {game.round}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex w-[40%] flex-col items-end gap-3">
                        <img
                          src={game.guestTeam?.logoPathURL}
                          className="w-36 h-36"
                        />
                        <p className="text-2xl text-phoenix font-extrabold">
                          {game.guestTeam.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllGames;

