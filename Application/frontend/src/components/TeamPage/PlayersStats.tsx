import { Outlet, useNavigate } from "react-router";
import { Player } from "../../models/Player.model";
import { Tooltip, Typography, Popover, Button } from "@material-tailwind/react";
import { CiCircleInfo } from "react-icons/ci";

type Props = {
  players: Player[];
};

const TABLE_HEAD = [
  "JN",
  "FN",
  "P",
  "MPG",
  "PPG",
  "APG",
  "RPG",
  "SPG",
  "BPG",
  "TPG",
  "FGP",
  "TPP",
  "TWOPP",
  "FTP",
  "PIR",
  "+/-",
];

const TABLE_HEAD_MEANING = [
  { abbr: "JN", meaning: "Jersey Number" },
  { abbr: "FN", meaning: "Full Name" },
  { abbr: "P", meaning: "Position" },
  { abbr: "MPG", meaning: "Minutes Per Game" },
  { abbr: "PPG", meaning: "Points Per Game" },
  { abbr: "APG", meaning: "Assists Per Game" },
  { abbr: "RPG", meaning: "Rebounds Per Game" },
  { abbr: "SPG", meaning: "Steals Per Game" },
  { abbr: "BPG", meaning: "Blocks Per Game" },
  { abbr: "TPG", meaning: "Turnovers Per Game" },
  { abbr: "FGP", meaning: "Field Goal Percentage" },
  { abbr: "TPP", meaning: "Three-Point Percentage" },
  { abbr: "TWOPP", meaning: "Two-Point Percentage" },
  { abbr: "FTP", meaning: "Free Throw Percentage" },
  { abbr: "PIR", meaning: "Player Impact Rating" },
  { abbr: "+/-", meaning: "Plus-Minus (Team Impact)" },
];

const PlayersStats = (props: Props) => {
  const navigate = useNavigate();

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
        <Popover placement="left">
          <Popover.Trigger
            as={Button}
            className="border-0 hover:border-0 bg-transparent hover:bg-transparent"
          >
            <CiCircleInfo className="h-8 w-8  dark:text-white text-black" />
          </Popover.Trigger>
          <Popover.Content className="p-5 bg-surface-light dark:bg-surface-dark border-2 border-black dark:text-white text-black z-10">
            <Typography className="font-extrabold text-center">
              Table Head meaning
            </Typography>
            <Typography type="small" className="">
              <br />
              {TABLE_HEAD_MEANING.map((th, index) => (
                <div key={index}>
                  <strong>{th.abbr}</strong>
                  {` - ${th.meaning}`}
                </div>
              ))}
            </Typography>
            <Popover.Arrow />
          </Popover.Content>
        </Popover>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-surface overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700  hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300 scrollbar-thumb-rounded scrollbar-track-rounded">
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
            {props.players.map((player, index) => {
              return (
                <Tooltip key={index}>
                  <Tooltip.Trigger
                    as="tr"
                    className="even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                    onClick={() => handleRowClick(player)}
                  >
                    <td className="p-5">{player.jerseyNumber}</td>
                    <td className="p-5 text-nowrap">
                      {`${player.firstName} ${player.lastName}`}
                    </td>
                    <td className="p-5">{player.position}</td>
                    <td className="p-5">{player.minutesPerGame.toFixed(2)}</td>
                    <td className="p-5">{player.pointsPerGame.toFixed(2)}</td>
                    <td className="p-5">{player.assistsPerGame.toFixed(2)}</td>
                    <td className="p-5">{player.reboundsPerGame.toFixed(2)}</td>
                    <td className="p-5">{player.stealsPerGame.toFixed(2)}</td>
                    <td className="p-5">{player.blocksPerGame.toFixed(2)}</td>
                    <td className="p-5">
                      {player.turnoversPerGame.toFixed(2)}
                    </td>
                    <td className="p-5">
                      {`${player.fieldGoalPercentage.toFixed(2)} % ${
                        player.fieldGoalMade
                      } /
                      ${player.fieldGoalMiss + player.fieldGoalMade}`}
                    </td>
                    <td className="p-5">
                      {`${player.threePointPercentage.toFixed(2)} % ${
                        player.threePointMade
                      } /
                      ${player.threePointMade + player.threePointMiss}`}{" "}
                    </td>
                    <td className="p-5">
                      {`${player.twoPointsPercentage.toFixed(2)} % ${
                        player.twoPointMade
                      } /
                      ${player.twoPointMade + player.twoPointMiss}`}{" "}
                    </td>
                    <td className="p-5">
                      {`${player.freeThrowPercentage.toFixed(2)} % ${
                        player.freeThrowMade
                      } /
                      ${player.freeThrowMade + player.freeThrowMiss}`}{" "}
                    </td>
                    <td className="p-5">{player.pir.toFixed(2)}</td>
                    <td className="p-5">{player.plusMinusIndex.toFixed(2)}</td>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="dark:bg-white dark:text-black">
                    Click to see full player page
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip>
              );
            })}
          </tbody>
        </table>
        <Outlet />
      </div>
    </>
  );
};

export default PlayersStats;
