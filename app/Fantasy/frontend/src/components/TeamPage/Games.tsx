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

  return (
    <div className="flex flex-col gap-5">
      {games &&
        games.map((game, index) => {
          const coachStats = getCoachStatsForGame(index);

          const isFinished = coachStats && coachStats.difference !== 0;
          console.log("game:", game);
          console.log("coachId:", game.homeTeam?.coach?.id);
          console.log("gameId:", game.id);
          return (
            <div
              key={index}
              className="flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl "
            >
              <div className="flex w-[40%]  flex-col gap-3 ">
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
                {game.homeTeamScore > 0 && game.guestTeamScore > 0 && (
                  <div className="flex justify-center items-center text-5xl">
                    <div
                      className={`border-2 border-black rounded-l-2xl dark:border-white border-r-0 p-5 ${
                        game.homeTeamScore > game.guestTeamScore
                          ? "bg-success"
                          : "bg-error"
                      }`}
                    >
                      {game.homeTeamScore}
                    </div>
                    <div
                      className={`border-2 border-black rounded-r-2xl dark:border-white  p-5 ${
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

                <div className="flex justify-center items-center">
                  {game.homeTeamScore != 0 &&
                    game.guestTeamScore != 0 &&
                    !isFinished && (
                      <span
                        className="px-6 py-3 text-xl font-extrabold rounded-full 
                    </div>
              bg-red-600 text-white animate-pulse shadow-lg w-fit"
                      >
                        🔴 LIVE
                      </span>
                    )}

                  {isFinished && (
                    <span
                      className="px-6 py-3 text-xl font-extrabold rounded-full 
            bg-gray-700 text-white shadow-lg w-fit"
                    >
                      ✅ FINISHED
                    </span>
                  )}
                </div>
              </div>

              <div className="flex w-[40%] items-end flex-col gap-3 text-center">
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
        })}
    </div>
  );
};

export default Games;
