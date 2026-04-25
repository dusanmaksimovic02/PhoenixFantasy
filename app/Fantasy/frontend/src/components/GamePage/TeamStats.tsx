import { getPlayersStatsFromGame } from "../../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type FC } from "react";

interface TeamStatsProps {
  gameId: string;
  homeTeamId: string;
  guestTeamId: string;
}

const TeamStats: FC<TeamStatsProps> = ({ gameId, homeTeamId, guestTeamId }) => {
  const { data: homeTeamPayersStats } = useQuery({
    queryKey: ["homeTeamPlayersStats", gameId, homeTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, homeTeamId),
  });

  const { data: guestTeamPayersStats } = useQuery({
    queryKey: ["guestTeamPlayersStats", gameId, guestTeamId],
    queryFn: () => getPlayersStatsFromGame(gameId, guestTeamId),
  });

  const calculatedHomeTeamStats = useMemo(() => {
    if (!homeTeamPayersStats || homeTeamPayersStats.length === 0) return null;

    const totals = homeTeamPayersStats.reduce(
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
  }, [homeTeamPayersStats]);

  const calculatedGuestTeamStats = useMemo(() => {
    if (!guestTeamPayersStats || guestTeamPayersStats.length === 0) return null;

    const totals = guestTeamPayersStats.reduce(
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
  }, [guestTeamPayersStats]);

  const teamStatCategories = [
    { label: "Performance Index Rating", key: "pir" },
    { label: "Points", key: "points" },
    { label: "Assist", key: "assists" },
    { label: "Defensive Rebounds", key: "drpg" },
    { label: "Offensive Rebounds", key: "orpg" },
    { label: "Total Rebounds", key: "rebounds" },
    { label: "Steals", key: "steals" },
    { label: "Block", key: "blocks" },
    { label: "Turnovers", key: "turnovers", lowerIsBetter: true },
    { label: "Free Throws Percentage", key: "ftp" },
    { label: "Two Points Percentage", key: "twop" },
    { label: "Three Points Percentage", key: "threep" },
    { label: "Personal Fouls", key: "fouls", lowerIsBetter: true },
    { label: "Blocks Received", key: "rbpg", lowerIsBetter: true },
    { label: "Fouls Received", key: "rfpg" },
    { label: "Technical Fouls", key: "tfpg", lowerIsBetter: true },
  ];

  return (
    <div className="w-full overflow-hidden rounded-lg border-2 border-surface">
      <table className="w-full">
        <tbody className="group text-black dark:text-white">
        { calculatedGuestTeamStats && calculatedHomeTeamStats &&teamStatCategories.map((cat) => {
            const homeRaw = calculatedHomeTeamStats[cat.key as keyof typeof calculatedHomeTeamStats];
            const guestRaw = calculatedGuestTeamStats[cat.key as keyof typeof calculatedGuestTeamStats];

            const homeVal = parseFloat(homeRaw.toString());
            const guestVal = parseFloat(guestRaw.toString());

            let homeIsWinner = false;
            let guestIsWinner = false;

            if (homeVal === guestVal) {
              homeIsWinner = true;
              guestIsWinner = true;
            } else if (cat.lowerIsBetter) {
              homeIsWinner = homeVal < guestVal;
              guestIsWinner = guestVal < homeVal;
            } else {
              homeIsWinner = homeVal > guestVal;
              guestIsWinner = guestVal > homeVal;
            }

            return (
              <tr 
                key={cat.key} 
                className="border-2 border-surface last:border-0 even:bg-surface-light dark:even:bg-surface-dark"
              >
                <td className={`p-3 text-center font-semibold ${homeIsWinner ? "bg-phoenix text-white" : ""}`}>
                  {homeRaw}
                </td>
                <td className="p-3 text-center font-bold text-lg border-x-2 border-surface">
                  {cat.label}
                </td>
                <td className={`p-3 text-center font-semibold ${guestIsWinner ? "bg-phoenix text-white" : ""}`}>
                  {guestRaw}
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
