import type { PlayerGameStats } from "../../models/PlayerGameStats";
import { getTeamPlayersFromGame } from "../../services/LiveGameService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type FC } from "react";

const tableHead = [
  "Player",
  // "MIN",
  "PTS",
  "1pts m/a",
  "1pts %",
  "2pts m/a",
  "2pts %",
  "3pts m/a",
  "3pts %",
  "TR",
  "OFR",
  "DFR",
  "AST",
  "STL",
  "TO",
  "BF",
  "BA",
  "FC",
  "FD",
  "T",
  "PIR",
  // "+/-",
];

type Props = {
  team: string;
  teamId: string;
  gameId: string;
};

const TeamTable: FC<Props> = ({ team, teamId, gameId }) => {
  const { data: teamPlayers = [] } = useQuery({
    queryKey: ["teamPlayers", teamId, gameId],
    queryFn: () => getTeamPlayersFromGame(teamId, gameId),
  });

  const totals = useMemo(() => {
    return teamPlayers.reduce(
      (acc, curr) => {
        const oneAtt = curr.made1p + curr.miss1p;
        const twoAtt = curr.made2p + curr.miss2p;
        const threeAtt = curr.made3p + curr.miss3p;

        return {
          points: acc.points + curr.points,
          oneMade: acc.oneMade + curr.made1p,
          oneAttempt: acc.oneAttempt + oneAtt,
          twoMade: acc.twoMade + curr.made2p,
          twoAttempt: acc.twoAttempt + twoAtt,
          threeMade: acc.threeMade + curr.made3p,
          threeAttempt: acc.threeAttempt + threeAtt,
          rebTotal: acc.rebTotal + curr.rebounds,
          rebOff: acc.rebOff + curr.offensiveRebounds,
          rebDef: acc.rebDef + curr.defensiveRebounds,
          assists: acc.assists + curr.assists,
          steals: acc.steals + curr.steals,
          turnovers: acc.turnovers + curr.turnovers,
          blocksFor: acc.blocksFor + curr.blocks,
          blocksAgainst: acc.blocksAgainst + curr.recievedBlocks,
          foulsComm: acc.foulsComm + curr.personalFouls,
          foulsDrawn: acc.foulsDrawn + curr.recievedFouls,
          tech: acc.tech + curr.technicalFouls,
          pir: acc.pir + curr.pir,
        };
      },
      {
        points: 0,
        oneMade: 0,
        oneAttempt: 0,
        twoMade: 0,
        twoAttempt: 0,
        threeMade: 0,
        threeAttempt: 0,
        rebTotal: 0,
        rebOff: 0,
        rebDef: 0,
        assists: 0,
        steals: 0,
        turnovers: 0,
        blocksFor: 0,
        blocksAgainst: 0,
        foulsComm: 0,
        foulsDrawn: 0,
        tech: 0,
        pir: 0,
      },
    );
  }, [teamPlayers]);

  return (
    <div className="p-10 pt-0">
      <h3 className="text-phoenix px-10 pb-5">{team}</h3>
      <div className="w-full h-fit rounded-4xl border border-surface overflow-x-auto">
        <table className="w-full rounded-4xl ">
          <thead className="border-[3px] border-surface bg-surface-light text-lg font-medium text-foreground rounded-4xl  dark:bg-surface-dark">
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="px-2.5 py-2  text-start  font-medium "
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-black dark:text-white ">
            {teamPlayers.map((playerStats: PlayerGameStats) => (
              <tr
                key={playerStats.id}
                className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer"
              >
                <td className="p-3 text-center">
                  {playerStats.player.jerseyNumber}{" "}
                  {playerStats.player.firstName}
                  {playerStats.player.lastName}
                </td>
                {/* <td className="p-3 text-center">{}</td> */}
                <td className="p-3 text-center">{playerStats.points}</td>
                <td className="p-3 text-center">
                  {playerStats.made1p}/{playerStats.miss1p + playerStats.made1p}
                </td>
                <td className="p-3 text-center">
                  {Math.round(
                    (playerStats.made1p /
                      (playerStats.miss1p + playerStats.made1p)) *
                      100,
                  )}{" "}
                  %
                </td>
                <td className="p-3 text-center">
                  {playerStats.made2p}/{playerStats.miss2p + playerStats.made2p}
                </td>
                <td className="p-3 text-center">
                  {Math.round(
                    (playerStats.made2p /
                      (playerStats.miss2p + playerStats.made2p)) *
                      100,
                  )}{" "}
                  %
                </td>
                <td className="p-3 text-center">
                  {playerStats.made3p}/{playerStats.miss3p + playerStats.made3p}
                </td>
                <td className="p-3 text-center">
                  {Math.round(
                    (playerStats.made3p /
                      (playerStats.miss3p + playerStats.made3p)) *
                      100,
                  )}{" "}
                  %
                </td>
                <td className="p-3 text-center">{playerStats.rebounds}</td>
                <td className="p-3 text-center">
                  {playerStats.offensiveRebounds}
                </td>
                <td className="p-3 text-center">
                  {playerStats.defensiveRebounds}
                </td>
                <td className="p-3 text-center">{playerStats.assists}</td>
                <td className="p-3 text-center">{playerStats.steals}</td>
                <td className="p-3 text-center">{playerStats.turnovers}</td>
                <td className="p-3 text-center">{playerStats.blocks}</td>
                <td className="p-3 text-center">
                  {playerStats.recievedBlocks}
                </td>
                <td className="p-3 text-center">{playerStats.personalFouls}</td>
                <td className="p-3 text-center">{playerStats.recievedFouls}</td>
                <td className="p-3 text-center">
                  {playerStats.technicalFouls}
                </td>
                <td className="p-3 text-center">{playerStats.pir}</td>
                {/* <td className="p-3 text-center">{}</td> */}
              </tr>
            ))}

            {/* <tr className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer">
              <td className="p-3 text-center">Team</td>
              <td className="p-3 text-center"></td> 
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center"></td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">1</td>
              <td className="p-3 text-center">0</td>
              <td className="p-3 text-center">10</td>
              <td className="p-3 text-center">54</td> 
            </tr> */}

            <tr className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer">
              {Array.from({ length: tableHead.length }).map((_, i) => (
                <td key={i} className="p-3 text-center">
                  {i === 0 && "Coach"}
                  {i === 19 && "0"}
                  {i === 20 && "10"}
                </td>
              ))}
            </tr>
            <tr className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer">
              {Array.from({ length: tableHead.length }).map((_, i) => (
                <td key={i} className="p-3 text-center">
                  {i === 0 && "Bench"}
                  {i === 19 && "0"}
                </td>
              ))}
            </tr>
            <tr className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer">
              <td className="p-3 text-center">Total</td>
              {/* <td className="p-3 text-center">
                {Math.floor(totals.minutes / 60)}:
                {(totals.minutes % 60).toString().padStart(2, "0")}
              </td> */}
              <td className="p-3 text-center">{totals.points}</td>
              <td className="p-3 text-center">
                {totals.oneMade} / {totals.oneAttempt}
              </td>
              <td className="p-3 text-center">
                {Math.round((totals.oneMade / totals.oneAttempt) * 100)} %
              </td>
              <td className="p-3 text-center">
                {totals.twoMade} / {totals.twoAttempt}
              </td>
              <td className="p-3 text-center">
                {Math.round((totals.twoMade / totals.twoAttempt) * 100)} %
              </td>
              <td className="p-3 text-center">
                {" "}
                {totals.threeMade} / {totals.threeAttempt}
              </td>
              <td className="p-3 text-center">
                {Math.round((totals.threeMade / totals.threeAttempt) * 100)} %
              </td>
              <td className="p-3 text-center">{totals.rebTotal}</td>
              <td className="p-3 text-center">{totals.rebOff}</td>
              <td className="p-3 text-center">{totals.rebDef}</td>
              <td className="p-3 text-center">{totals.assists}</td>
              <td className="p-3 text-center">{totals.steals}</td>
              <td className="p-3 text-center">{totals.turnovers}</td>
              <td className="p-3 text-center">{totals.blocksFor}</td>
              <td className="p-3 text-center">{totals.blocksAgainst}</td>
              <td className="p-3 text-center">{totals.foulsComm}</td>
              <td className="p-3 text-center">{totals.foulsDrawn}</td>
              <td className="p-3 text-center">{totals.tech}</td>
              <td className="p-3 text-center">{totals.pir}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTable;
