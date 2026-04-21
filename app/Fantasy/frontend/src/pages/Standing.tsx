import { Link } from "react-router-dom";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/StatsService";
import type { TeamStanding } from "../models/TeamStanding";

const TABLE_HEAD = ["Position", "Club", "GP", "Won", "Lost", "H", "A"];

const Standing: FC = () => {
  const { data: teamStanding } = useQuery({
    queryKey: ["teamStanding"],
    queryFn: () => getStandings(),
  });
  return (
    <div className="w-screen h-fit min-h-screen flex justify-center items-center p-7 pb-10 pt-14">
      <div className="w-full h-fit mt-10 border border-surface overflow-hidden max-sm:overflow-x-scroll ">
        <table className="w-full">
          <thead className="border-[3px] border-surface bg-surface-light text-lg font-medium text-foreground  dark:bg-surface-dark">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="px-2.5 py-2  text-start  font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-black dark:text-white">
            {teamStanding &&
              teamStanding.map((team: TeamStanding, index) => (
                <tr key={index} className="border-[3px] border-surface ">
                  <td className="p-3 font-extrabold">{index + 1}</td>
                  <td className="p-3 flex gap-5 items-center font-extrabold text-[18px] whitespace-nowrap w-75">
                    <Link
                      to={`/team/${team.teamName.replace(/\s+/g, "-").toLowerCase()}`}
                      className="flex justify-center items-center gap-5"
                      state={{ team, index }}
                    >
                      <img
                        src={`${team.logoPathUrl}`}
                        alt={`${team.teamName} logo`}
                        className="w-10 h-10"
                      />
                      {team.teamName}
                    </Link>
                  </td>
                  <td className="p-3">{team.wins + team.losses}</td>
                  <td className="p-3">{team.wins}</td>
                  <td className="p-3">{team.losses}</td>
                  <td className="p-3 whitespace-nowrap">
                    {team.wins}-{team.losses}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {team.wins}-{team.losses}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standing;
