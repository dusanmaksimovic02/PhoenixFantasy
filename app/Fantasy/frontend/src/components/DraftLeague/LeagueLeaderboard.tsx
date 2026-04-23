import { type FC } from "react";

type LeaderboardEntry = {
  id: string;
  rank: number;
  teamName: string;
  username: string;
  totalPoints: number;
  isMe: boolean;
};


const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", rank: 1, teamName: "Dream Team", username: "MilosMilic", totalPoints: 142.5, isMe: false },
  { id: "2", rank: 2, teamName: "KK KAKOO", username: "Darko12", totalPoints: 128.0, isMe: true },
  { id: "3", rank: 3, teamName: "Balkan Bulls", username: "NikolaP", totalPoints: 115.5, isMe: false },
  { id: "4", rank: 4, teamName: "Phoenix Rising", username: "Stefan99", totalPoints: 98.0, isMe: false },
  { id: "5", rank: 5, teamName: "Thunders", username: "Marko22", totalPoints: 87.5, isMe: false },
];

const LeagueLeaderboard: FC = () => {
  return (
    <div className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-md overflow-hidden">
      <div className="bg-phoenix px-4 py-3">
        <h2 className="text-white font-bold text-lg">Leaderboard</h2>
        <p className="text-white/70 text-xs">Round standings</p>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {MOCK_LEADERBOARD.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3 transition-colors
              ${entry.isMe
                ? "bg-phoenix/10 border-l-4 border-phoenix"
                : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
          >
            
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${entry.rank === 1 ? "bg-yellow-400 text-black"
                  : entry.rank === 2 ? "bg-gray-300 text-black"
                  : entry.rank === 3 ? "bg-amber-600 text-white"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200"
                }`}
            >
              {entry.rank}
            </div>

            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {entry.teamName}
                {entry.isMe && (
                  <span className="ml-2 text-phoenix text-xs font-normal">(you)</span>
                )}
              </p>
              <p className="text-xs text-gray-400 truncate">@{entry.username}</p>
            </div>

           
            <div className="text-right shrink-0">
              <p className="font-bold text-phoenix text-sm">{entry.totalPoints}</p>
              <p className="text-xs text-gray-400">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueLeaderboard;