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
  const { data: homeTeamPayersStats } = useQuery({
    queryKey: ["homeTeamPlayersStats", gameId, homeTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, homeTeamId),
  });

  const { data: guestTeamPayersStats } = useQuery({
    queryKey: ["guestTeamPlayersStats", gameId, guestTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, guestTeamId),
  });

  const getLeader = (stats: PlayerStats[] | undefined, path: string) => {
    if (!stats || stats.length === 0) return { name: "-", value: 0 };

    const getValue = (obj: any, path: string): number => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj) || 0;
    };

    const leader = stats.reduce((prev, current) =>
      getValue(prev, path) >= getValue(current, path) ? prev : current,
    );

    return {
      name: leader.fullName,
      value: getValue(leader, path),
    };
  };

  const formatValue = (value: number, isPercentage: boolean) => {
    return isPercentage ? value.toFixed(1) : value.toString();
  };

  const statCategories = [
    { label: "PIR", path: "pir", isPercentage: false },
    { label: "Points", path: "points", isPercentage: false },
    { label: "Assists", path: "assists", isPercentage: false },
    { label: "Total Rebounds", path: "rebounds", isPercentage: false },
    {
      label: "Offensive Rebounds",
      path: "offensiveRebounds",
      isPercentage: false,
    },
    {
      label: "Defensive Rebounds",
      path: "defensiveRebounds",
      isPercentage: false,
    },
    { label: "Steals", path: "steals", isPercentage: false },
    { label: "Blocks", path: "blocks", isPercentage: false },
    {
      label: "Turnovers",
      path: "turnovers",
      isPercentage: false,
      lowerIsBetter: true,
    },
    {
      label: "Blocks Received",
      path: "receivedBlocks",
      isPercentage: false,
      lowerIsBetter: true,
    },
    {
      label: "Personal Fouls",
      path: "personalFouls",
      isPercentage: false,
      lowerIsBetter: true,
    },
    { label: "Fouls Received", path: "receivedFouls", isPercentage: false },
    {
      label: "Technical Fouls",
      path: "technicalFouls",
      isPercentage: false,
      lowerIsBetter: true,
    },
    {
      label: "Free Throws %",
      path: "freeThrow.percentage",
      isPercentage: true,
    },
    { label: "2FG %", path: "twoPoint.percentage", isPercentage: true },
    { label: "3FG %", path: "threePoint.percentage", isPercentage: true },
  ];

  return (
    <>
      <h3 className="text-center text-black dark:text-white font-semibold">
        Result by quarters
      </h3>

      <br />

      <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-foreground dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-start">Team</th>
              <th className="px-2.5 py-2 text-center">1</th>
              <th className="px-2.5 py-2 text-center">2</th>
              <th className="px-2.5 py-2 text-center">3</th>
              <th className="px-2.5 py-2 text-center">4</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            <tr className="border-b border-surface ">
              <td className="p-3">Team 1</td>
              <td className="p-3 text-center">23</td>
              <td className="p-3 text-center">15</td>
              <td className="p-3 text-center bg-phoenix">19</td>
              <td className="p-3 text-center bg-phoenix">33</td>
            </tr>
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 2</td>
              <td className="p-3 bg-phoenix text-center">26</td>
              <td className="p-3 text-center  bg-phoenix">16</td>
              <td className="p-3 text-center">13</td>
              <td className="p-3 text-center">28</td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <h3 className="text-center text-black dark:text-white font-semibold">
        Result by end of quarters
      </h3>

      <br />

      <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
        <table className="w-full">
          <thead className="border-2 border-surface bg-surface-light text-foreground dark:bg-surface-dark">
            <tr>
              <th className="px-2.5 py-2 text-start">Team</th>
              <th className="px-2.5 py-2 text-center">1</th>
              <th className="px-2.5 py-2 text-center">2</th>
              <th className="px-2.5 py-2 text-center">3</th>
              <th className="px-2.5 py-2 text-center">4</th>
            </tr>
          </thead>
          <tbody className="group text-black dark:text-white">
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 1</td>
              <td className="p-3 text-center">23</td>
              <td className="p-3 text-center">38</td>
              <td className="p-3 text-center bg-phoenix">57</td>
              <td className="p-3 text-center bg-phoenix">90</td>
            </tr>
            <tr className="border-b border-surface last:border-0">
              <td className="p-3">Team 2</td>
              <td className="p-3 text-center bg-phoenix">26</td>
              <td className="p-3 text-center bg-phoenix">42</td>
              <td className="p-3 text-center">55</td>
              <td className="p-3 text-center">83</td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <h3 className="text-center text-black dark:text-white font-semibold">
        Game leaders
      </h3>

      <br />

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
            {statCategories.map((cat) => {
              const homeLeader = getLeader(homeTeamPayersStats, cat.path);
              const guestLeader = getLeader(guestTeamPayersStats, cat.path);

              let homeIsWinner = false;
              let guestIsWinner = false;

              if (cat.lowerIsBetter) {
                homeIsWinner = homeLeader.value <= guestLeader.value;
                guestIsWinner = guestLeader.value <= homeLeader.value;
              } else {
                homeIsWinner = homeLeader.value >= guestLeader.value;
                guestIsWinner = guestLeader.value >= homeLeader.value;
              }
              return (
                <tr
                  key={cat.path}
                  className="border-2 border-surface even:bg-surface-light dark:even:bg-surface-dark"
                >
                  <td className="p-3 text-center">{homeLeader.name}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      homeIsWinner ? "bg-phoenix text-white" : ""
                    }`}
                  >
                    {formatValue(homeLeader.value, cat.isPercentage)}
                    {cat.isPercentage ? "%" : ""}
                  </td>
                  <td className="p-3 text-center font-bold text-lg border-x-2 border-surface">
                    {cat.label}
                  </td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      guestIsWinner ? "bg-phoenix text-white" : ""
                    }`}
                  >
                    {formatValue(guestLeader.value, cat.isPercentage)}
                    {cat.isPercentage ? "%" : ""}
                  </td>
                  <td className="p-3 text-center">{guestLeader.name}</td>
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
