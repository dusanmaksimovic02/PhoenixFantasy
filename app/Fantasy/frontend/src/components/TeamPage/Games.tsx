import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getAllGamesForTeam,
  getCoachGameStats,
} from "../../services/StatsService";
import { useEffect, useRef, useState, type FC } from "react";
import * as signalR from "@microsoft/signalr";

const FANTASY_API_URL = "https://localhost:7035";

type Props = {
  teamId: string;
};

type LiveScore = {
  homeTeamScore: number;
  guestTeamScore: number;
};

const Games: FC<Props> = ({ teamId }) => {
  const { data: games } = useQuery({
    queryKey: ["games", teamId],
    queryFn: () => getAllGamesForTeam(teamId),
  });

  const coachStatsQueries = useQueries({
    queries: (games ?? []).map((game) => {
      const coachId = game.homeTeam?.coach?.id;
      return {
        queryKey: ["coachStats", game.id],
        queryFn: () => getCoachGameStats(coachId!, game.id),
        enabled: !!game.id && !!coachId,
      };
    }),
  });

  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const liveGameIds = (games ?? [])
    .filter((game, index) => {
      const coachStats = coachStatsQueries[index]?.data;
      const isFinished = coachStats && coachStats.difference !== 0;
      return game.homeTeamScore > 0 && game.guestTeamScore > 0 && !isFinished;
    })
    .map((game) => game.id);

  useEffect(() => {
    if (liveGameIds.length === 0) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${FANTASY_API_URL}/gameScoreHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("GameScoreUpdated", (data) => {
      setLiveScores((prev) => ({
        ...prev,
        [data.gameId]: {
          homeTeamScore: data.homeTeamScore,
          guestTeamScore: data.guestTeamScore,
        },
      }));
    });

    connection
      .start()
      .then(async () => {
        for (const gameId of liveGameIds) {
          await connection.invoke("JoinGame", gameId);
          console.log(`[SignalR] Joined game group: ${gameId}`);
        }
      })
      .catch((err) => {
        console.error("[SignalR] Connection failed:", err);
      });

    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        liveGameIds.forEach((gameId) => {
          connectionRef.current?.invoke("LeaveGame", gameId).catch(() => {});
        });
        connectionRef.current.stop();
      }
    };
  }, [liveGameIds.join(",")]);

  const getCoachStatsForGame = (index: number) => {
    return coachStatsQueries[index]?.data;
  };

  return (
    <div className="flex flex-col gap-5">
      {games &&
        games.map((game, index) => {
          const coachStats = getCoachStatsForGame(index);
          const isFinished = coachStats && coachStats.difference !== 0;

          const liveScore = liveScores[game.id];
          const homeScore = liveScore?.homeTeamScore ?? game.homeTeamScore;
          const guestScore = liveScore?.guestTeamScore ?? game.guestTeamScore;
          const isLive = homeScore > 0 && guestScore > 0 && !isFinished;

          return (
            <div
              key={index}
              className={`flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl
                ${isLive ? "ring-2 ring-red-500/50" : ""}`}
            >
              <div className="flex w-[40%] flex-col gap-3">
                <img
                  src={`${game.homeTeam?.logoPathURL}`}
                  alt={`${game.homeTeam} logo`}
                  className="w-36 h-36 justify-self-start"
                />
                <p className="text-2xl justify-self-start text-phoenix font-extrabold">
                  {game.homeTeam.name}
                </p>
              </div>

              <div className="flex w-[20%] flex-col gap-5">
                {homeScore > 0 && guestScore > 0 && (
                  <div className="flex justify-center items-center text-5xl">
                    <div
                      className={`border-2 border-black rounded-l-2xl dark:border-white border-r-0 p-5 transition-all duration-300
                        ${homeScore > guestScore ? "bg-success" : "bg-error"}
                        ${liveScore ? "scale-105" : ""}`}
                    >
                      {homeScore}
                    </div>
                    <div
                      className={`border-2 border-black rounded-r-2xl dark:border-white p-5 transition-all duration-300
                        ${guestScore > homeScore ? "bg-success" : "bg-error"}
                        ${liveScore ? "scale-105" : ""}`}
                    >
                      {guestScore}
                    </div>
                  </div>
                )}

                {homeScore === 0 && guestScore === 0 && (
                  <div className="flex flex-col text-center font-semibold">
                    <p>{game.dateTime?.split("T")[0]}</p>
                    <p>{game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
                    <p>{game.venue}</p>
                  </div>
                )}

                <div className="flex justify-center items-center">
                  {isLive && (
                    <span className="px-6 py-3 text-xl font-extrabold rounded-full bg-red-600 text-white animate-pulse shadow-lg w-fit">
                      🔴 LIVE
                    </span>
                  )}
                  {isFinished && (
                    <span className="px-6 py-3 text-xl font-extrabold rounded-full bg-gray-700 text-white shadow-lg w-fit">
                      ✅ FINISHED
                    </span>
                  )}
                </div>
              </div>

              <div className="flex w-[40%] items-end flex-col gap-3 text-center">
                <img
                  src={`${game.guestTeam?.logoPathURL}`}
                  alt="away logo"
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
  );
};

export default Games;
