import type { PlayerStats } from "../../models/PlayerStats";
import { getPlayersStatsFromGame } from "../../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface GameInfoProps {
  gameId: string;
  homeTeamId: string;
  guestTeamId: string;
}

const GameInfo: FC<GameInfoProps> = ({ gameId, homeTeamId, guestTeamId }) => {
  const { data: home } = useQuery({
    queryKey: ["homeTeamPlayersStats", gameId, homeTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, homeTeamId),
  });

  const { data: guest } = useQuery({
    queryKey: ["guestTeamPlayersStats", gameId, guestTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, guestTeamId),
  });

  const getLeader = (stats: PlayerStats[] | undefined, path: string) => {
    if (!stats || stats.length === 0) return { name: "-", value: 0 };
    const get = (obj: any, p: string): number =>
      p.split(".").reduce((a, b) => a?.[b], obj) || 0;
    const leader = stats.reduce((a, b) =>
      get(a, path) >= get(b, path) ? a : b
    );
    return { name: leader.fullName, value: get(leader, path) };
  };

  const format = (v: number, pct: boolean) =>
    pct ? v.toFixed(1) : v.toString();

  const statCategories = [
    { label: "Performance Index Rating", path: "pir", pct: false },
    { label: "Points", path: "points", pct: false },
    { label: "Assists", path: "assists", pct: false },
    { label: "Total Rebounds", path: "rebounds", pct: false },
    { label: "Offensive Rebounds", path: "offensiveRebounds", pct: false },
    { label: "Defensive Rebounds", path: "defensiveRebounds", pct: false },
    { label: "Steals", path: "steals", pct: false },
    { label: "Blocks", path: "blocks", pct: false },
    { label: "Turnovers", path: "turnovers", pct: false, low: true },
    { label: "Blocks Received", path: "receivedBlocks", pct: false, low: true },
    { label: "Personal Fouls", path: "personalFouls", pct: false, low: true },
    { label: "Fouls Received", path: "receivedFouls", pct: false },
    { label: "Technical Fouls", path: "technicalFouls", pct: false, low: true },
    { label: "Free Throws %", path: "freeThrow.percentage", pct: true },
    { label: "Two Points %", path: "twoPoint.percentage", pct: true },
    { label: "Three Points %", path: "threePoint.percentage", pct: true },
  ];

  return (
    <>
      <h3 className="text-center text-2xl font-bold mb-4">Game Leaders</h3>

      <div className="w-full overflow-auto rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-phoenix font-bold text-2xl dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-center">Player</th>
              <th className="px-2.5 py-2 text-center"></th>
              <th className="px-2.5 py-2 text-center">by</th>
              <th className="px-2.5 py-2 text-center"></th>
              <th className="px-2.5 py-2 text-center">Player</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            {statCategories.map((s) => {
              const h = getLeader(home, s.path);
              const g = getLeader(guest, s.path);

              let homeWin = false;
              let guestWin = false;

              if (h.value === g.value) {
                homeWin = true;
                guestWin = true;
              } else if (s.low) {
                homeWin = h.value < g.value;
                guestWin = g.value < h.value;
              } else {
                homeWin = h.value > g.value;
                guestWin = g.value > h.value;
              }

              return (
                <tr
                  key={s.path}
                  className="border-2 border-surface even:bg-surface-light dark:even:bg-surface-dark"
                >
                  <td className="p-3 text-center">{h.name}</td>
                  <td className={`p-3 text-center font-semibold ${homeWin ? "bg-phoenix text-white" : ""}`}>
                    {format(h.value, s.pct)}{s.pct && "%"}
                  </td>
                  <td className="p-3 text-center font-bold text-lg border-x-2 border-surface">
                    {s.label}
                  </td>
                  <td className={`p-3 text-center font-semibold ${guestWin ? "bg-phoenix text-white" : ""}`}>
                    {format(g.value, s.pct)}{s.pct && "%"}
                  </td>
                  <td className="p-3 text-center">{g.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GameInfo;