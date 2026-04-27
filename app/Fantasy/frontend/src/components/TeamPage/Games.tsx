import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGamesForTeam } from "../../services/StatsService";
import { useEffect, useState, type FC } from "react";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

const FANTASY_API_URL = "https://localhost:7035";

type Props = { teamId: string };
type LiveScore = { homeTeamScore: number; guestTeamScore: number };
type GameState = "SCHEDULED" | "LIVE" | "FINISHED";

const Games: FC<Props> = ({ teamId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: games } = useQuery({
    queryKey: ["games", teamId],
    queryFn: () => getAllGamesForTeam(teamId),
  });

  const [liveScores, setLiveScores] = useState<Record<string, LiveScore>>({});
  const [liveStatuses, setLiveStatuses] = useState<Record<string, GameState>>(
    {},
  );

  const handleClick = (game: any) => {
    const team1 = game.homeTeam.name.replace(/\s+/g, "-");
    const team2 = game.guestTeam.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`, {
      state: { gameId: game.id },
    });
  };

  useEffect(() => {
    if (!games) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${FANTASY_API_URL}/gameScoreHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("GameStarted", (data) => {
      setLiveStatuses((prev) => ({
        ...prev,
        [data.gameId]: "LIVE",
      }));
    });

    connection.on("GameScoreUpdated", (data) => {
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

      queryClient.invalidateQueries({ queryKey: ["games", teamId] });
    });

    connection
      .start()
      .then(async () => {
        console.log("[SignalR] Connected");

        for (const game of games) {
          await connection.invoke("JoinTeam", game.homeTeam.id);
          await connection.invoke("JoinTeam", game.guestTeam.id);
        }

        console.log("[SignalR] Joined team groups");
      })
      .catch((err) => console.error("SignalR error:", err));

    return () => {
      connection.stop();
    };
  }, [games, teamId, queryClient]);

  return (
    <div className="flex flex-col gap-5">
      {games?.map((game) => {
        const liveScore = liveScores[game.id];
        const homeScore = liveScore?.homeTeamScore ?? game.homeTeamScore ?? 0;
        const guestScore =
          liveScore?.guestTeamScore ?? game.guestTeamScore ?? 0;

        let currentStatus: GameState;

        if (game.gameEnded) currentStatus = "FINISHED";
        else if (liveStatuses[game.id]) currentStatus = liveStatuses[game.id];
        else if (homeScore > 0 || guestScore > 0) currentStatus = "LIVE";
        else currentStatus = "SCHEDULED";

        const homeWin = homeScore > guestScore;
        const guestWin = guestScore > homeScore;

        return (
          <div
            key={game.id}
            onClick={() => handleClick(game)} 
            className={`flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl cursor-pointer
            ${currentStatus === "LIVE" ? "ring-2 ring-red-500/50" : ""}`}
          >
            <div className="flex w-[40%] flex-col gap-3">
              <img src={game.homeTeam?.logoPathURL} className="w-36 h-36" />
              <p className="text-2xl text-phoenix font-extrabold">
                {game.homeTeam?.name}
              </p>
            </div>

            <div className="flex w-[20%] flex-col gap-5 items-center">
              {currentStatus !== "SCHEDULED" ? (
                <div className="flex text-5xl">
                  <div
                    className={`border-2 p-5 rounded-l-2xl ${
                      homeWin ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {homeScore}
                  </div>
                  <div
                    className={`border-2 p-5 rounded-r-2xl ${
                      guestWin ? "bg-green-500" : "bg-red-500"
                    }`}
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
                {currentStatus === "FINISHED" && (
                  <span className="bg-gray-700 text-white px-5 py-2 rounded-full">
                    ✅ Finished — Round {game.round}
                  </span>
                )}
                {currentStatus === "LIVE" && (
                  <span className="bg-red-600 text-white px-5 py-2 rounded-full animate-pulse">
                    🔴 LIVE
                  </span>
                )}
                {currentStatus === "SCHEDULED" && (
                  <span className="bg-yellow-500 text-black px-5 py-2 rounded-full">
                    🕒 Scheduled — Round {game.round}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-[40%] flex-col items-end gap-3">
              <img src={game.guestTeam?.logoPathURL} className="w-36 h-36" />
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
