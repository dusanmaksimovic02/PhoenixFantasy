import { useNavigate } from "react-router-dom";
import { type Player } from "../../models/Player.model";
import type { FC } from "react";

type Props = {
  players: Player[];
};

const TABLE_HEAD = [
  "Full name",
  "Position",
  "Country",
  "Age",
  "Height",
  "Weight",
  "Jersey Number",
];

const Players: FC<Props> = (props) => {
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
          {props.players.map((player) => {
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
                <td className="p-3 text-nowrap">
                  {`${player.firstName} ${player.lastName}`}
                </td>
                <td className="p-3">{player.position}</td>
                <td className="p-3">{player.country}</td>
                <td className="p-3">{player.age}</td>
                <td className="p-3">{player.height}</td>
                <td className="p-3">{player.weight}</td>
                <td className="p-3">{player.jerseyNumber}</td>
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
