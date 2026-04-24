import { getTeamAveragePlayerStats } from "../../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type FC } from "react";
import { CiCircleInfo } from "react-icons/ci";

const TABLE_HEAD: string[] = [
  "P",
  "GP",
  "W",
  "L",
  "WP",
  "PPG",
  "APG",
  "RPG",
  "ORPG",
  "DRPG",
  "SPG",
  "TPG",
  "BPG",
  "RBPG",
  "FPG",
  "RFPG",
  "TFPG",
  "1P %",
  "2P %",
  "3P %",
  "ER",
];

const teamStatsMeaning: { abbr: string; meaning: string }[] = [
  { abbr: "P", meaning: "Position" },
  { abbr: "GP", meaning: "Games Played" },
  { abbr: "W", meaning: "Wins" },
  { abbr: "L", meaning: "Losses" },
  { abbr: "WP", meaning: "Win Percentage" },
  { abbr: "PPG", meaning: "Points Per Game" },
  { abbr: "APG", meaning: "Assists Per Game" },
  { abbr: "RPG", meaning: "Rebounds Per Game" },
  { abbr: "ORPG", meaning: "Offensive Rebounds Per Game" },
  { abbr: "DRPG", meaning: "Defensive Rebounds Per Game" },
  { abbr: "SPG", meaning: "Steals Per Game" },
  { abbr: "TPG", meaning: "Turnovers Per Game" },
  { abbr: "BPG", meaning: "Blocks Per Game" },
  { abbr: "RBPG", meaning: "Received Blocks Per Game" },
  { abbr: "FPG", meaning: "Fouls Per Game" },
  { abbr: "RFPG", meaning: "Received Fouls Per Game" },
  { abbr: "TFPG", meaning: "Technical Fouls Per Game" },
  { abbr: "1P %", meaning: "Free Throw Percentage" },
  { abbr: "2P %", meaning: "Two-Point Percentage" },
  { abbr: "3P %", meaning: "Three-Point Percentage" },
  { abbr: "ER", meaning: "Efficiency Rating (PIR)" },
];

interface TeamStatsProps {
  teamId: string;
  position: number;
  gamePlayed: number;
  gameWon: number;
  gameLost: number;
  winPercentage: string;
}

const TeamStats: FC<TeamStatsProps> = ({
  teamId,
  position,
  gamePlayed,
  gameWon,
  gameLost,
  winPercentage,
}) => {
  const { data: playerStats } = useQuery({
    queryKey: ["playerStats", teamId],
    queryFn: () => getTeamAveragePlayerStats(teamId),
  });

  const calculatedTeamStats = useMemo(() => {
    if (!playerStats || playerStats.length === 0) return null;

    const totals = playerStats.reduce(
      (acc, player) => {
        return {
          ppg: acc.ppg + player.points,
          apg: acc.apg + player.assists,
          rpg: acc.rpg + player.rebounds,
          orpg: acc.orpg + (player.offensiveRebounds ?? 0),
          drpg: acc.drpg + (player.defensiveRebounds ?? 0),
          spg: acc.spg + player.steals,
          bpg: acc.bpg + player.blocks,
          rbpg: acc.rbpg + player.receivedBlocks,
          tpg: acc.tpg + player.turnovers,
          ftMade: acc.ftMade + player.freeThrow.made,
          ftMissed: acc.ftMissed + player.freeThrow.missed,
          twoMade: acc.twoMade + player.twoPoint.made,
          twoMissed: acc.twoMissed + player.twoPoint.missed,
          threeMade: acc.threeMade + player.threePoint.made,
          threeMissed: acc.threeMissed + player.threePoint.missed,
          pir: acc.pir + player.pir,
          fouls: acc.fouls + (player.personalFouls ?? 0),
          rfpg: acc.rfpg + (player.receivedFouls ?? 0),
          tfpg: acc.tfpg + (player.technicalFouls ?? 0),
        };
      },
      {
        ppg: 0,
        apg: 0,
        rpg: 0,
        orpg: 0,
        drpg: 0,
        spg: 0,
        bpg: 0,
        rbpg: 0,
        tpg: 0,
        ftMade: 0,
        ftMissed: 0,
        twoMade: 0,
        twoMissed: 0,
        threeMade: 0,
        threeMissed: 0,
        pir: 0,
        fouls: 0,
        rfpg: 0,
        tfpg: 0,
      },
    );

    const calcPct = (made: number, missed: number) =>
      made + missed > 0
        ? ((made / (made + missed)) * 100).toFixed(1) + "%"
        : "0%";

    return {
      points: totals.ppg.toFixed(1),
      assists: totals.apg.toFixed(1),
      rebounds: totals.rpg.toFixed(1),
      orpg: totals.orpg.toFixed(1),
      drpg: totals.drpg.toFixed(1),
      steals: totals.spg.toFixed(1),
      turnovers: totals.tpg.toFixed(1),
      blocks: totals.bpg.toFixed(1),
      ftp: calcPct(totals.ftMade, totals.ftMissed),
      twop: calcPct(totals.twoMade, totals.twoMissed),
      threep: calcPct(totals.threeMade, totals.threeMissed),
      pir: totals.pir.toFixed(1),
      fouls: totals.fouls.toFixed(1),
      rbpg: totals.rbpg.toFixed(1),
      rfpg: totals.rfpg.toFixed(1),
      tfpg: totals.tfpg.toFixed(1),
    };
  }, [playerStats]);

  return (
    <div className="h-100">
      <div className="w-full p-5 flex justify-end">
        <div className={`dropdown dropdown-center dropdown-left`}>
          <label
            tabIndex={0}
            className="btn btn-ghost p-0 hover:bg-transparent"
          >
            <CiCircleInfo className="h-8 w-8 text-black dark:text-white" />
          </label>

          <div
            tabIndex={0}
            className="dropdown-content z-100 w-fit h-fit max-sm:w-70 rounded-xl border-2 border-black bg-surface-light p-5 shadow-lg dark:bg-surface-dark dark:text-white text-black"
          >
            <p className="font-extrabold text-nowrap text-center mb-2">
              Table Head meaning
            </p>

            <div className="text-sm w-fit text-nowrap max-sm:text-wrap">
              {teamStatsMeaning.map((th, index) => (
                <div key={index}>
                  <strong>{th.abbr}</strong> – {th.meaning}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-surface overflow-x-scroll">
        <table className="w-full text-nowrap whitespace-nowrap">
          <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-3.5 py-3 text-start font-extrabold text-lg text-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="group text-sm text-black dark:text-white ">
            <tr className="even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-5">{position}</td>
              <td className="p-5">{gamePlayed}</td>
              <td className="p-5">{gameWon}</td>
              <td className="p-5">{gameLost}</td>
              <td className="p-5">{winPercentage}</td>
              <td className="p-5">{calculatedTeamStats?.points}</td>
              <td className="p-5">{calculatedTeamStats?.assists}</td>
              <td className="p-5">{calculatedTeamStats?.rebounds}</td>
              <td className="p-5">{calculatedTeamStats?.orpg}</td>
              <td className="p-5">{calculatedTeamStats?.drpg}</td>
              <td className="p-5">{calculatedTeamStats?.steals}</td>
              <td className="p-5">{calculatedTeamStats?.turnovers}</td>
              <td className="p-5">{calculatedTeamStats?.blocks}</td>
              <td className="p-5">{calculatedTeamStats?.rbpg}</td>
              <td className="p-5">{calculatedTeamStats?.fouls}</td>
              <td className="p-5">{calculatedTeamStats?.rfpg}</td>
              <td className="p-5">{calculatedTeamStats?.tfpg}</td>
              <td className="p-5">{calculatedTeamStats?.ftp}</td>
              <td className="p-5">{calculatedTeamStats?.twop}</td>
              <td className="p-5">{calculatedTeamStats?.threep}</td>
              <td className="p-5">{calculatedTeamStats?.pir}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamStats;
