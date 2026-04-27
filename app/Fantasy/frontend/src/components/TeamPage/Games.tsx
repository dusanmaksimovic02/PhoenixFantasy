import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGamesForTeam } from "../../services/StatsService";
import { useEffect, useState, type FC } from "react";
import * as signalR from "@microsoft/signalr";

const FANTASY_API_URL = "https://localhost:7035";

type Props = { teamId: string };
type LiveScore = { homeTeamScore: number; guestTeamScore: number };
type GameState = "SCHEDULED" | "LIVE" | "FINISHED";

const Games: FC<Props> = ({ teamId }) => {
  const queryClient = useQueryClient();

  const { data: games } = useQuery({
    queryKey: ["games", teamId],
    queryFn: () => getAllGamesForTeam(teamId),
  });

  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const [liveStatuses, setLiveStatuses] = useState<Record<string, GameState>>(
    {},
  );

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${FANTASY_API_URL}/gameScoreHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("GameStarted", (data) => {
      console.log("[SignalR] GameStarted received:", data);
      setLiveStatuses((prev) => ({ ...prev, [data.gameId]: "LIVE" }));
    });

    connection.on("GameScoreUpdated", (data) => {
      console.log("[SignalR] GameScoreUpdated received:", data);
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
      console.log("[SignalR] GameEnded received:", data);
      setLiveStatuses((prev) => ({ ...prev, [data.gameId]: "FINISHED" }));

      setLiveScores((prev) => ({
        ...prev,
        [data.gameId]: {
          homeTeamScore: data.homeTeamScore,
          guestTeamScore: data.guestTeamScore,
        },
      }));

      queryClient.invalidateQueries({ queryKey: ["games", teamId] });
    });

    connection
      .start()
      .then(() => {
        connection
          .invoke("JoinTeam", teamId)
          .then(() => console.log(`[SignalR] Joined team group: ${teamId}`))
          .catch((err) => console.error("JoinTeam Error:", err));
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      connection.invoke("LeaveTeam", teamId).catch(() => {});
      connection.stop();
    };
  }, [teamId, queryClient]);

  return (
    <div className="flex flex-col gap-5">
      {games?.map((game) => {
        const liveScore = liveScores[game.id];
        const homeScore = liveScore?.homeTeamScore ?? game.homeTeamScore ?? 0;
        const guestScore =
          liveScore?.guestTeamScore ?? game.guestTeamScore ?? 0;

        let currentStatus: GameState;
        if (game.gameEnded) {
          currentStatus = "FINISHED";
        } else if (liveStatuses[game.id]) {
          currentStatus = liveStatuses[game.id];
        } else if (homeScore > 0 || guestScore > 0) {
          currentStatus = "LIVE";
        } else {
          currentStatus = "SCHEDULED";
        }

        const homeWin = homeScore > guestScore;
        const guestWin = guestScore > homeScore;

        return (
          <div
            key={game.id}
            className={`flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl
              ${currentStatus === "LIVE" ? "ring-2 ring-red-500/50" : ""}`}
          >
            <div className="flex w-[40%] flex-col gap-3">
              <img
                src={game.homeTeam?.logoPathURL}
                className="w-36 h-36"
                alt="Home"
              />
              <p className="text-2xl text-phoenix font-extrabold">
                {game.homeTeam?.name}
              </p>
            </div>

            <div className="flex w-[20%] flex-col gap-5 items-center">
              {currentStatus !== "SCHEDULED" ? (
                <div className="flex justify-center items-center text-5xl font-mono">
                  <div
                    className={`border-2 border-black dark:border-white p-5 rounded-l-2xl transition-all duration-300
                      ${homeWin ? "bg-success" : "bg-error"}
                      ${currentStatus === "LIVE" ? "scale-105" : ""}`}
                  >
                    {homeScore}
                  </div>
                  <div
                    className={`border-2 border-black dark:border-white p-5 rounded-r-2xl transition-all duration-300
                      ${guestWin ? "bg-success" : "bg-error"}
                      ${currentStatus === "LIVE" ? "scale-105" : ""}`}
                  >
                    {guestScore}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col text-center font-semibold gap-1">
                  <p>{game.dateTime?.split("T")[0]}</p>
                  <p>{game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
                  <p className="text-sm text-gray-400">{game.venue}</p>
                </div>
              )}

              <div className="flex justify-center">
                {currentStatus === "FINISHED" && (
                  <span className="px-6 py-3 text-xl font-extrabold rounded-full bg-gray-700 text-white shadow-lg">
                    ✅ FINISHED — Round {game.round}
                  </span>
                )}
                {currentStatus === "LIVE" && (
                  <span className="px-6 py-3 text-xl font-extrabold rounded-full bg-red-600 text-white animate-pulse shadow-lg">
                    🔴 LIVE
                  </span>
                )}
                {currentStatus === "SCHEDULED" && (
                  <span className="px-6 py-3 text-xl font-extrabold rounded-full bg-yellow-500 text-black shadow-lg">
                    🕒 Coming up — Round {game.round}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-[40%] flex-col items-end gap-3">
              <img
                src={game.guestTeam?.logoPathURL}
                className="w-36 h-36"
                alt="Guest"
              />
              <p className="text-2xl text-phoenix font-extrabold">
                {game.guestTeam?.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Games;
