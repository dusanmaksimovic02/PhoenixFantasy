import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getAllGamesForTeam,
  getCoachGameStats,
} from "../../services/StatsService";
import type { FC } from "react";

type Props = {
  teamId: string;
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

  const getCoachStatsForGame = (index: number) => {
    return coachStatsQueries[index]?.data;
  };
  {
    return (
      games &&
      games.map((game, index) => {
        const coachStats = getCoachStatsForGame(index);

        const isFinished = coachStats && coachStats.difference !== 0;

        return (
          <div
            key={index}
            className="flex max-sm:flex-col justify-between items-center gap-5 p-5 bg-surface-light dark:bg-surface-dark/70 rounded-3xl "
          >
            <div className="flex justify-center items-center flex-col gap-3 text-center">
              <img
                src={`${game.homeTeam?.logoPathURL}`}
                alt={`${game.homeTeam} logo`}
                className="w-36 h-36"
              />
              <p className="text-2xl text-phoenix font-extrabold">
                {game.homeTeam.name}
              </p>
            </div>

            <div className=" flex flex-col gap-5">
              {game.homeTeamScore > 0 && game.guestTeamScore > 0 && (
                <div className=" flex text-5xl">
                  <div
                    className={`border-2 border-r-0 p-5 ${
                      game.homeTeamScore > game.guestTeamScore
                        ? "bg-success"
                        : "bg-error"
                    }`}
                  >
                    {game.homeTeamScore}
                  </div>
                  <div
                    className={`border-2 p-5 ${
                      game.guestTeamScore > game.homeTeamScore
                        ? "bg-success"
                        : "bg-error"
                    }`}
                  >
                    {game.guestTeamScore}
                  </div>
                </div>
              )}

              {game.homeTeamScore == 0 && game.guestTeamScore == 0 && (
                <div className="flex flex-col text-center font-semibold">
                  <p>{game.dateTime?.split("T")[0]}</p>
                  <p>{game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
                  <p>{game.venue}</p>
                </div>
              )}

              {/* LIVE */}
              {game.homeTeamScore != 0 &&
                game.guestTeamScore != 0 &&
                !isFinished && (
                  <span
                    className="px-6 py-3 text-xl font-extrabold rounded-full 
              bg-red-600 text-white animate-pulse shadow-lg"
                  >
                    🔴 LIVE
                  </span>
                )}

              {/* FINISHED */}
              {isFinished && (
                <span
                  className="px-6 py-3 text-xl font-extrabold rounded-full 
            bg-gray-700 text-white shadow-lg"
                >
                  ✅ FINISHED
                </span>
              )}
            </div>

            <div className="flex justify-center items-center flex-col gap-3 text-center">
              <img
                src={`${game.guestTeam?.logoPathURL}`}
                alt="home logo"
                className="w-36 h-36"
              />
              <p className="text-2xl text-phoenix font-extrabold">
                {game.guestTeam.name}
              </p>
            </div>
          </div>
        );
      })
    );
  }
};

export default Games;
