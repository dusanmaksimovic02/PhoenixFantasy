import { useNavigate } from "react-router-dom";
import { type Player } from "../../models/Player";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlayersByTeam } from "../../services/StatsService";

type Props = {
  teamId: string;
  teamName: string;
};

const TABLE_HEAD = ["No", "Full name", "Position", "Date of birth"];

const Players: FC<Props> = ({ teamId, teamName }) => {
  const navigate = useNavigate();

  const { data: players } = useQuery({
    queryKey: ["players"],
    queryFn: () => getPlayersByTeam(teamId),
  });

  const handleRowClick = (player: Player) => {
    const playerName = `${player.firstName}-${player.lastName}`
      .toLowerCase()
      .replace(/\s+/g, "-");
    const team = teamName.toLowerCase().replace(/\s+/g, "-");

    navigate(`/team/${team}/${playerName}`, {
      state: { player },
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-surface max-sm:overflow-x-scroll">
      <table className="w-full">
        <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="px-2.5 py-2 text-start font-bold text-lg text-nowrap"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="group text-sm text-black dark:text-white ">
          {players &&
            players.map((player: Player) => {
              return (
                <tr
                  key={player.id}
                  className="even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                  onClick={() => handleRowClick(player)}
                >
                  {/* <tr
                    key={index}
                    className="even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                    onClick={() => handleRowClick(player)}
                  > */}
                  <td className="p-3">{player.jerseyNumber}</td>
                  <td className="p-3 text-nowrap">
                    {`${player.firstName} ${player.lastName}`}
                  </td>
                  <td className="p-3">{player.position}</td>
                  <td className="p-3">{player.dateOfBirth}</td>
                  {/* </tr> */}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Players;
