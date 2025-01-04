import { Link } from "react-router";
import { TeamShort } from "../models/TeamShort.model";

const TABLE_HEAD = ["Position", "Club", "GP", "Won", "Lost", "H", "A", "+/-"];

const TABLE_ROWS: TeamShort[] = [
  {
    id: 1,
    position: 1,
    club: "Phoenix Suns",
    gp: 82,
    won: 55,
    lost: 27,
    home: "30-11",
    away: "25-16",
    plusMinus: "+7.5",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
  },
  {
    id: 2,
    position: 2,
    club: "Golden State Warriors",
    gp: 82,
    won: 53,
    lost: 29,
    home: "29-12",
    away: "24-17",
    plusMinus: "+6.8",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
  },
  {
    id: 3,
    position: 3,
    club: "Los Angeles Lakers",
    gp: 82,
    won: 52,
    lost: 30,
    home: "28-13",
    away: "24-17",
    plusMinus: "+5.2",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
  },
  {
    id: 4,
    position: 4,
    club: "Boston Celtics",
    gp: 82,
    won: 50,
    lost: 32,
    home: "27-14",
    away: "23-18",
    plusMinus: "+4.9",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
  },
  {
    id: 5,
    position: 5,
    club: "Milwaukee Bucks",
    gp: 82,
    won: 48,
    lost: 34,
    home: "26-15",
    away: "22-19",
    plusMinus: "+4.1",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
  },
  {
    id: 6,
    position: 6,
    club: "Miami Heat",
    gp: 82,
    won: 46,
    lost: 36,
    home: "25-16",
    away: "21-20",
    plusMinus: "+3.8",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg",
  },
  {
    id: 7,
    position: 7,
    club: "Dallas Mavericks",
    gp: 82,
    won: 45,
    lost: 37,
    home: "24-17",
    away: "21-20",
    plusMinus: "+2.9",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg",
  },
  {
    id: 8,
    position: 8,
    club: "Philadelphia 76ers",
    gp: 82,
    won: 44,
    lost: 38,
    home: "23-18",
    away: "21-20",
    plusMinus: "+2.5",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg",
  },
  {
    id: 9,
    position: 9,
    club: "Denver Nuggets",
    gp: 82,
    won: 43,
    lost: 39,
    home: "22-19",
    away: "21-20",
    plusMinus: "+1.8",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
  },
  {
    id: 10,
    position: 10,
    club: "Chicago Bulls",
    gp: 82,
    won: 41,
    lost: 41,
    home: "21-20",
    away: "20-21",
    plusMinus: "+1.0",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg",
  },
];

const Standing = () => {
  return (
    <div className="w-screen h-fit flex justify-center items-center p-7 pb-10 pt-[3.5rem]">
      <div className="w-full h-fit mt-10 rounded-lg border border-surface overflow-hidden max-sm:overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700  hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300 scrollbar-thumb-rounded scrollbar-track-rounded">
        <table className="w-full">
          <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="px-2.5 py-2 text-start font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="group text-sm text-black dark:text-white">
            {TABLE_ROWS.map((row: TeamShort, index) => (
              <tr key={index} className="border-b border-surface last:border-0">
                <td className="p-3 font-extrabold">{row.position}</td>
                <td className="p-3 flex gap-5 items-center font-extrabold text-[18px] whitespace-nowrap w-[300px]">
                  <Link
                    to={`/team/${row.club.replace(/\s+/g, "-").toLowerCase()}`}
                    className="flex justify-center items-center gap-5"
                    state={ row }
                  >
                    <img src={row.logoUrl} alt="logo" className="w-10 h-10" />
                    {row.club}
                  </Link>
                </td>
                <td className="p-3">{row.gp}</td>
                <td className="p-3">{row.won}</td>
                <td className="p-3">{row.lost}</td>
                <td className="p-3 whitespace-nowrap">{row.home}</td>
                <td className="p-3 whitespace-nowrap">{row.away}</td>
                <td className="p-3">{row.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standing;
