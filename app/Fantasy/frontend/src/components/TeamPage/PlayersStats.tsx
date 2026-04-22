import { useNavigate } from "react-router-dom";
import { type Player } from "../../models/Player.model";
import { CiCircleInfo } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { getTeamAveragePlayerStats } from "../../services/StatsService";

type Props = {
  teamId: string;
};

const TABLE_HEAD = [
  "No.",
  "Name",
  "PPG",
  "APG",
  "RPG",
  "SPG",
  "TPG",
  "BPG",
  "1P",
  "1P %",
  "2P",
  "2P %",
  "3P",
  "3P %",
  "PIR",
];

const TABLE_HEAD_MEANING = [
  { abbr: "No.", meaning: "Jersey Number" },
  { abbr: "Name", meaning: "Full Name" },
  { abbr: "PPG", meaning: "Points Per Game" },
  { abbr: "APG", meaning: "Assists Per Game" },
  { abbr: "RPG", meaning: "Rebounds Per Game" },
  { abbr: "SPG", meaning: "Steals Per Game" },
  { abbr: "TPG", meaning: "Turnovers Per Game" },
  { abbr: "BPG", meaning: "Blocks Per Game" },
  { abbr: "1P", meaning: "Free Throws" },
  { abbr: "1P %", meaning: "Free Throw Percentage" },
  { abbr: "2P", meaning: "Two-Point Shots" },
  { abbr: "2P %", meaning: "Two-Point Percentage" },
  { abbr: "3P", meaning: "Three-Point Shots" },
  { abbr: "3P %", meaning: "Three-Point Percentage" },
  { abbr: "PIR", meaning: "Player Impact Rating" },
];

const PlayersStats: FC<Props> = ({ teamId }) => {
  const navigate = useNavigate();
  const { data: playerStats } = useQuery({
    queryKey: ["playerStats", teamId],
    queryFn: () => getTeamAveragePlayerStats(teamId),
  });
  const handleRowClick = (player: Player) => {
    const playerName = `${player.firstName}-${player.lastName}`
      .toLowerCase()
      .replace(/\s+/g, "-");
    const team = player.team.toLowerCase().replace(/\s+/g, "-");

    navigate(`/team/${team}/${playerName}`, {
      state: { player },
    });
  };
  return (
    <>
      <div className="p-5 w-full flex justify-end">
        <div className="dropdown dropdown-left">
          <label
            tabIndex={0}
            className="btn btn-ghost p-0 hover:bg-transparent"
          >
            <CiCircleInfo className="h-8 w-8 text-black dark:text-white" />
          </label>

          <div
            tabIndex={0}
            className="dropdown-content z-10 w-72 rounded-xl border-2 border-black bg-surface-light p-5 shadow-lg dark:bg-surface-dark text-black dark:text-white"
          >
            <p className="font-extrabold text-center mb-2">
              Table Head meaning
            </p>

            <div className="text-sm space-y-1">
              {TABLE_HEAD_MEANING.map((th, index) => (
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
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="px-3.5 py-3 text-start font-extrabold text-lg text-nowrap"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="group text-sm text-black dark:text-white ">
            {playerStats?.map((player, index) => (
              <tr
                key={index}
                className="table-row even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                //onClick={() => handleRowClick(player)}
              >
                <td className="p-5">{player.jerseyNumber}</td>
                <td className="p-5 text-nowrap">{player.fullName}</td>

                <td className="p-5">{player.points.toFixed(1)}</td>
                <td className="p-5">{player.assists.toFixed(1)}</td>
                <td className="p-5">{player.rebounds.toFixed(1)}</td>
                <td className="p-5">{player.steals.toFixed(1)}</td>
                <td className="p-5">{player.blocks.toFixed(1)}</td>
                <td className="p-5">{player.personalFouls.toFixed(1)}</td>

                <td className="p-5">
                  {`${player.freeThrow.made}/${player.freeThrow.made + player.freeThrow.missed}`}
                </td>

                <td className="p-5">
                  {`${player.freeThrow.percentage.toFixed(0)}%`}
                </td>

                <td className="p-5">
                  {`${player.twoPoint.made}/${player.twoPoint.made + player.twoPoint.missed}`}
                </td>

                <td className="p-5">
                  {`${player.twoPoint.percentage.toFixed(0)}%`}
                </td>

                <td className="p-5">
                  {`${player.threePoint.made}/${player.threePoint.made + player.threePoint.missed}`}
                </td>

                <td className="p-5">
                  {`${player.threePoint.percentage.toFixed(0)}%`}
                </td>

                <td className="p-5">{player.pir.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PlayersStats;
