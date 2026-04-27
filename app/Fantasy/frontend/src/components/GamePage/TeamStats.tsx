import { getPlayersStatsFromGame } from "../../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type FC } from "react";

interface TeamStatsProps {
  gameId: string;
  homeTeamId: string;
  guestTeamId: string;
}

const TeamStats: FC<TeamStatsProps> = ({ gameId, homeTeamId, guestTeamId }) => {
  const { data: homeTeamStats } = useQuery({
    queryKey: ["homeTeamPlayersStats", gameId, homeTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, homeTeamId),
  });

  const { data: guestTeamStats } = useQuery({
    queryKey: ["guestTeamPlayersStats", gameId, guestTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, guestTeamId),
  });

  const calculate = (stats: any[] | undefined) => {
    if (!stats || stats.length === 0) return null;

    const t = stats.reduce(
      (acc, p) => ({
        ppg: acc.ppg + p.points,
        apg: acc.apg + p.assists,
        rpg: acc.rpg + p.rebounds,
        orpg: acc.orpg + (p.offensiveRebounds ?? 0),
        drpg: acc.drpg + (p.defensiveRebounds ?? 0),
        spg: acc.spg + p.steals,
        bpg: acc.bpg + p.blocks,
        rbpg: acc.rbpg + p.receivedBlocks,
        tpg: acc.tpg + p.turnovers,
        ftMade: acc.ftMade + p.freeThrow.made,
        ftMissed: acc.ftMissed + p.freeThrow.missed,
        twoMade: acc.twoMade + p.twoPoint.made,
        twoMissed: acc.twoMissed + p.twoPoint.missed,
        threeMade: acc.threeMade + p.threePoint.made,
        threeMissed: acc.threeMissed + p.threePoint.missed,
        pir: acc.pir + p.pir,
        fouls: acc.fouls + (p.personalFouls ?? 0),
        rfpg: acc.rfpg + (p.receivedFouls ?? 0),
        tfpg: acc.tfpg + (p.technicalFouls ?? 0),
      }),
      {
        ppg: 0, apg: 0, rpg: 0, orpg: 0, drpg: 0,
        spg: 0, bpg: 0, rbpg: 0, tpg: 0,
        ftMade: 0, ftMissed: 0,
        twoMade: 0, twoMissed: 0,
        threeMade: 0, threeMissed: 0,
        pir: 0, fouls: 0, rfpg: 0, tfpg: 0,
      }
    );

    const pct = (m: number, mi: number) =>
      m + mi > 0 ? ((m / (m + mi)) * 100).toFixed(1) + "%" : "0%";

    return {
      pir: t.pir.toFixed(1),
      points: t.ppg.toFixed(1),
      assists: t.apg.toFixed(1),
      rebounds: t.rpg.toFixed(1),
      orpg: t.orpg.toFixed(1),
      drpg: t.drpg.toFixed(1),
      steals: t.spg.toFixed(1),
      blocks: t.bpg.toFixed(1),
      turnovers: t.tpg.toFixed(1),
      ftMade: t.ftMade.toFixed(0),
      ftAttempted: (t.ftMade + t.ftMissed).toFixed(0),
      ftp: pct(t.ftMade, t.ftMissed),
      twoMade: t.twoMade.toFixed(0),
      twoAttempted: (t.twoMade + t.twoMissed).toFixed(0),
      twop: pct(t.twoMade, t.twoMissed),
      threeMade: t.threeMade.toFixed(0),
      threeAttempted: (t.threeMade + t.threeMissed).toFixed(0),
      threep: pct(t.threeMade, t.threeMissed),
      fouls: t.fouls.toFixed(1),
      rbpg: t.rbpg.toFixed(1),
      rfpg: t.rfpg.toFixed(1),
      tfpg: t.tfpg.toFixed(1),
    };
  };

  const home = useMemo(() => calculate(homeTeamStats), [homeTeamStats]);
  const guest = useMemo(() => calculate(guestTeamStats), [guestTeamStats]);

  const categories = [
    { label: "Performance Index Rating", key: "pir" },
    { label: "Points", key: "points" },
    { label: "Assist", key: "assists" },
    { label: "Defensive Rebounds", key: "drpg" },
    { label: "Offensive Rebounds", key: "orpg" },
    { label: "Total Rebounds", key: "rebounds" },
    { label: "Steals", key: "steals" },
    { label: "Block", key: "blocks" },
    { label: "Turnovers", key: "turnovers", lower: true },
    { label: "Free Throws Made", key: "ftMade" },
    { label: "Free Throws Attempted", key: "ftAttempted" },
    { label: "Free Throws Percentage", key: "ftp" },
    { label: "Three Points Made", key: "threeMade" },
    { label: "Three Points Attempted", key: "threeAttempted" },
    { label: "Three Points Percentage", key: "threep" },
    { label: "Two Points Made", key: "twoMade" },
    { label: "Two Points Attempted", key: "twoAttempted" },
    { label: "Two Points Percentage", key: "twop" },
  ];

  if (!home || !guest) return null;

  return (
    <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
      <table className="w-full">
        <tbody className="group text-black dark:text-white">
          {categories.map((c) => {
            const hVal = parseFloat((home as any)[c.key]);
            const gVal = parseFloat((guest as any)[c.key]);

            let homeWin = false;
            let guestWin = false;

            if (hVal === gVal) {
              homeWin = true;
              guestWin = true;
            } else if (c.lower) {
              homeWin = hVal < gVal;
              guestWin = gVal < hVal;
            } else {
              homeWin = hVal > gVal;
              guestWin = gVal > hVal;
            }

            return (
              <tr
                key={c.key}
                className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark"
              >
                <td className={`p-3 text-center font-semibold ${homeWin ? "bg-phoenix text-white" : ""}`}>
                  {(home as any)[c.key]}
                </td>
                <td className="p-3 text-center font-bold text-lg border-x-2 border-surface">
                  {c.label}
                </td>
                <td className={`p-3 text-center font-semibold ${guestWin ? "bg-phoenix text-white" : ""}`}>
                  {(guest as any)[c.key]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamStats;