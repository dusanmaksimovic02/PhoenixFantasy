import { getFantasyLeagueStandings } from "../../services/FantasyLeagueService";
import { useAuth } from "../../context/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";

type LeagueLeaderboardProps = {
  leagueId: string;
};

const LeagueLeaderboard: FC<LeagueLeaderboardProps> = ({ leagueId }) => {
  const { id } = useAuth();
  const { data: leagueLeaderboard } = useQuery({
    queryKey: ["leagueLeaderboard", leagueId],
    queryFn: () => getFantasyLeagueStandings(leagueId),
  });
  return (
    <div className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-md overflow-hidden">
      <div className="bg-phoenix px-4 py-3">
        <h2 className="text-white font-bold text-lg">Leaderboard</h2>
        <p className="text-white/70 text-xs">Round standings</p>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {leagueLeaderboard &&
          leagueLeaderboard.map((lp, index) => (
            <div
              key={index + 1}
              className={`flex items-center gap-3 px-4 py-3 transition-colors
              ${
                lp.userId == id
                  ? "bg-phoenix/10 border-l-4 border-phoenix"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${
                  index + 1 === 1
                    ? "bg-yellow-400 text-black"
                    : index + 1 === 2
                      ? "bg-gray-300 text-black"
                      : index + 1 === 3
                        ? "bg-amber-600 text-white"
                        : "bg-neutral-300 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200"
                }`}
              >
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {lp.teamName}
                  {lp.userId == id && (
                    <span className="ml-2 text-phoenix text-xs font-normal">
                      (you)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 truncate">@{lp.username}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-phoenix text-sm">
                  {lp.totalPoints}
                </p>
                <p className="text-xs text-gray-400">pts</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeagueLeaderboard;
