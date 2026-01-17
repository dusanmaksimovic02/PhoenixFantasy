import { useState, type FC } from "react";

const tableHead = [
  "Player",
  "MIN",
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
  "+/-",
];

type Props = {
  team: string;
};

const TeamTable: FC<Props> = ({ team }) => {
  const [players] = useState(() =>
    Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `Player${index + 1}`,
      surname: `State`,
      jerseyNumber: (index + 3) * 4,
      minutes: `${Math.floor(Math.random() * 31) + 5}:${Math.floor(
        Math.random() * 60,
      )
        .toString()
        .padStart(2, "0")}`,

      shooting: {
        oneMade: Math.floor(Math.random() * 4),
        oneAttempt:
          Math.floor(Math.random() * 4) + Math.floor(Math.random() * 3),

        twoMade: Math.floor(Math.random() * 6),
        twoAttempt:
          Math.floor(Math.random() * 6) + Math.floor(Math.random() * 4),

        threeMade: Math.floor(Math.random() * 5),
        threeAttempt:
          Math.floor(Math.random() * 5) + Math.floor(Math.random() * 4),

        points:
          Math.floor(Math.random() * 4) * 1 +
          Math.floor(Math.random() * 6) * 2 +
          Math.floor(Math.random() * 5) * 3,

        get onePct() {
          return this.oneAttempt === 0
            ? 0
            : Math.round((this.oneMade / this.oneAttempt) * 100);
        },

        get twoPct() {
          return this.twoAttempt === 0
            ? 0
            : Math.round((this.twoMade / this.twoAttempt) * 100);
        },

        get threePct() {
          return this.threeAttempt === 0
            ? 0
            : Math.round((this.threeMade / this.threeAttempt) * 100);
        },

        get missedShots() {
          return (
            this.oneAttempt -
            this.oneMade +
            this.twoAttempt -
            this.twoMade +
            this.threeAttempt -
            this.threeMade
          );
        },
      },

      rebounds: {
        offensive: Math.floor(Math.random() * 4),
        defensive: Math.floor(Math.random() * 7),
        total: Math.floor(Math.random() * 4) + Math.floor(Math.random() * 7),
      },

      defense: {
        blocksFor: Math.floor(Math.random() * 3),
        blocksAgainst: Math.floor(Math.random() * 2),
        steals: Math.floor(Math.random() * 4),
        turnovers: Math.floor(Math.random() * 5),
      },

      fouls: {
        committed: Math.floor(Math.random() * 5),
        drawn: Math.floor(Math.random() * 4),
        technical: Math.floor(Math.random() * 2),
      },

      assists: Math.floor(Math.random() * 8),

      get pir() {
        return (
          this.shooting.points +
          this.rebounds.total +
          this.assists +
          this.defense.steals +
          this.defense.blocksFor +
          this.fouls.drawn -
          this.shooting.missedShots -
          this.defense.turnovers -
          this.fouls.committed -
          this.defense.blocksAgainst
        );
      },

      get plusMinus() {
        return (
          this.shooting.points +
          this.assists +
          this.rebounds.total +
          this.defense.steals -
          this.defense.turnovers -
          this.fouls.committed
        );
      },
    })),
  );

  const totals = players.reduce(
    (acc, p) => {
      acc.points += p.shooting.points;

      acc.oneMade += p.shooting.oneMade;
      acc.oneAttempt += p.shooting.oneAttempt;

      acc.twoMade += p.shooting.twoMade;
      acc.twoAttempt += p.shooting.twoAttempt;

      acc.threeMade += p.shooting.threeMade;
      acc.threeAttempt += p.shooting.threeAttempt;

      acc.rebTotal += p.rebounds.total;
      acc.rebOff += p.rebounds.offensive;
      acc.rebDef += p.rebounds.defensive;

      acc.assists += p.assists;
      acc.steals += p.defense.steals;
      acc.turnovers += p.defense.turnovers;
      acc.blocksFor += p.defense.blocksFor;
      acc.blocksAgainst += p.defense.blocksAgainst;

      acc.foulsComm += p.fouls.committed;
      acc.foulsDrawn += p.fouls.drawn;
      acc.tech += p.fouls.technical;

      acc.pir += p.pir;
      acc.plusMinus += p.plusMinus;

      acc.minutes +=
        Number(p.minutes.split(":")[0]) * 60 + Number(p.minutes.split(":")[1]);

      return acc;
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
      plusMinus: 0,
      minutes: 0,
    },
  );

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
            {players.map((player) => (
              <tr
                key={player.id}
                className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer"
              >
                <td className="p-3 text-center">
                  {player.jerseyNumber} {player.name}
                  {player.surname}
                </td>
                <td className="p-3 text-center">{player.minutes}</td>
                <td className="p-3 text-center">{player.shooting.points}</td>
                <td className="p-3 text-center">
                  {player.shooting.oneMade}/{player.shooting.oneAttempt}
                </td>
                <td className="p-3 text-center">{player.shooting.onePct} %</td>
                <td className="p-3 text-center">
                  {player.shooting.twoMade}/{player.shooting.twoAttempt}
                </td>
                <td className="p-3 text-center">{player.shooting.twoPct} %</td>
                <td className="p-3 text-center">
                  {player.shooting.threeMade}/{player.shooting.threeAttempt}
                </td>
                <td className="p-3 text-center">
                  {player.shooting.threePct} %
                </td>
                <td className="p-3 text-center">{player.rebounds.total}</td>
                <td className="p-3 text-center">{player.rebounds.offensive}</td>
                <td className="p-3 text-center">{player.rebounds.defensive}</td>
                <td className="p-3 text-center">{player.assists}</td>
                <td className="p-3 text-center">{player.defense.steals}</td>
                <td className="p-3 text-center">{player.defense.turnovers}</td>
                <td className="p-3 text-center">{player.defense.blocksFor}</td>
                <td className="p-3 text-center">
                  {player.defense.blocksAgainst}
                </td>
                <td className="p-3 text-center">{player.fouls.committed}</td>
                <td className="p-3 text-center">{player.fouls.drawn}</td>
                <td className="p-3 text-center">{player.fouls.technical}</td>
                <td className="p-3 text-center">{player.pir}</td>
                <td className="p-3 text-center">{player.plusMinus}</td>
              </tr>
            ))}

            <tr className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer">
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
            </tr>

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
              <td className="p-3 text-center">
                {Math.floor(totals.minutes / 60)}:
                {(totals.minutes % 60).toString().padStart(2, "0")}
              </td>
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
              <td className="p-3 text-center">{totals.plusMinus}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTable;
