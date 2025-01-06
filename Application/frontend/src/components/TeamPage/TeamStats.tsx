import { Button, Popover, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";

const teamStats = {
  teamName: "Phoenix Suns",
  position: 1,
  games: {
    played: 82,
    won: 55,
    lost: 27,
    winPercentage: ((55 / 82) * 100).toFixed(2) + "%",
  },
  statistics: {
    pointsPerGame: 115.3,
    assistsPerGame: 27.5,
    reboundsPerGame: 44.1,
    stealsPerGame: 7.8,
    blocksPerGame: 4.5,
    turnoversPerGame: 13.2,
    fieldGoalPercentage: "47.5%",
    threePointPercentage: "37.1%",
    freeThrowPercentage: "79.3%",
    offensiveReboundsPerGame: 10.2,
    defensiveReboundsPerGame: 33.9,
    pointsAllowedPerGame: 111.2,
    efficiencyRating: 112.4,
    pace: 99.3,
    netRating: "+4.8",
    fastBreakPointsPerGame: 14.7,
    pointsInThePaintPerGame: 50.3,
    secondChancePointsPerGame: 13.5,
  },
};

const TABLE_HEAD: string[] = [
  "P",
  "GP",
  "W",
  "L",
  "WP",
  "PPG",
  "APG",
  "RPG",
  "SPG",
  "BPG",
  "TPG",
  "FGP",
  "TPP",
  "FTP",
  "ORPG",
  "DRPG",
  "PAPG",
  "ER",
  "PACE",
  "NETR",
  "FBP",
  "PITP",
  "SCP",
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
  { abbr: "SPG", meaning: "Steals Per Game" },
  { abbr: "BPG", meaning: "Blocks Per Game" },
  { abbr: "TPG", meaning: "Turnovers Per Game" },
  {
    abbr: "FGP",
    meaning: "Field Goal Percentage",
  },
  {
    abbr: "TPP",
    meaning: "Three Point Percentage",
  },
  {
    abbr: "FTP",
    meaning: "Free Throw Percentage",
  },
  {
    abbr: "ORPG",
    meaning: "Offensive Rebounds Per Game",
  },
  {
    abbr: "DRPG",
    meaning: "Defensive Rebounds Per Game",
  },
  {
    abbr: "PAPG",
    meaning: "Points Allowed Per Game",
  },
  { abbr: "ER", meaning: "Efficiency Rating" },
  { abbr: "PACE", meaning: "Average number of possessions per game" },
  { abbr: "NETR", meaning: "Net points per 100 possessions" },
  {
    abbr: "FBP",
    meaning: "Fast Break Points Per Game",
  },
  {
    abbr: "PITP",
    meaning: "Points In The Paint Per Game",
  },
  {
    abbr: "SCP",
    meaning: "Second Chance Points Per Game",
  },
];
const TeamStats = () => {
  const [placement, setPlacement] = useState<"left" | "bottom">("left");

  useEffect(() => {
    const handleResize = () => {
      setPlacement(window.innerWidth < 640 ? "bottom" : "left");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="w-full p-5 flex justify-end">
        <Popover placement={placement}>
          <Popover.Trigger
            as={Button}
            className="border-0 hover:border-0 bg-transparent hover:bg-transparent"
          >
            <CiCircleInfo className="h-8 w-8  dark:text-white text-black" />
          </Popover.Trigger>
          <Popover.Content className="bg-surface-light dark:bg-surface-dark dark:text-white text-black z-10 border-2 border-black p-5">
            <Typography className="font-extrabold text-center">
              Table Head meaning
            </Typography>
            <Typography type="small" className="max-sm:!w-[100px]">
              <br />
              {teamStatsMeaning.map((th, index) => (
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
            <tr className="even:bg-surface-light dark:even:bg-surface-dark">
              <td className="p-5">{teamStats.position}</td>
              <td className="p-5">{teamStats.games.played}</td>
              <td className="p-5">{teamStats.games.won}</td>
              <td className="p-5">{teamStats.games.lost}</td>
              <td className="p-5">{teamStats.games.winPercentage}</td>
              <td className="p-5">{teamStats.statistics.pointsPerGame}</td>
              <td className="p-5">{teamStats.statistics.assistsPerGame}</td>
              <td className="p-5">{teamStats.statistics.reboundsPerGame}</td>
              <td className="p-5">{teamStats.statistics.stealsPerGame}</td>
              <td className="p-5">{teamStats.statistics.blocksPerGame}</td>
              <td className="p-5">{teamStats.statistics.turnoversPerGame}</td>
              <td className="p-5">
                {teamStats.statistics.fieldGoalPercentage}
              </td>
              <td className="p-5">
                {teamStats.statistics.threePointPercentage}
              </td>
              <td className="p-5">
                {teamStats.statistics.freeThrowPercentage}
              </td>
              <td className="p-5">
                {teamStats.statistics.offensiveReboundsPerGame}
              </td>
              <td className="p-5">
                {teamStats.statistics.defensiveReboundsPerGame}
              </td>
              <td className="p-5">
                {teamStats.statistics.pointsAllowedPerGame}
              </td>
              <td className="p-5">{teamStats.statistics.efficiencyRating}</td>
              <td className="p-5">{teamStats.statistics.pace}</td>
              <td className="p-5">{teamStats.statistics.netRating}</td>
              <td className="p-5">
                {teamStats.statistics.fastBreakPointsPerGame}
              </td>
              <td className="p-5">
                {teamStats.statistics.pointsInThePaintPerGame}
              </td>
              <td className="p-5">
                {teamStats.statistics.secondChancePointsPerGame}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamStats;
