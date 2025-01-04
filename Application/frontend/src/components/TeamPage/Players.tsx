import { Outlet, useNavigate } from "react-router";
import { Player } from "../../models/Player.model";

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

const Players = (props: Props) => {
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
    <div className="w-full overflow-hidden rounded-lg border border-surface max-sm:overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700  hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300 scrollbar-thumb-rounded scrollbar-track-rounded">
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
          {props.players.map((player, index) => {
            return (
              <tr
                key={index}
                className="even:bg-surface-light dark:even:bg-surface-dark cursor-pointer"
                onClick={() => handleRowClick(player)}
              >
                <td className="p-3 text-nowrap">{`${player.firstName} ${player.lastName}`}</td>
                <td className="p-3">{player.position}</td>
                <td className="p-3">{player.country}</td>
                <td className="p-3">{player.age}</td>
                <td className="p-3">{player.height}</td>
                <td className="p-3">{player.weight}</td>
                <td className="p-3">{player.jerseyNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Outlet />
    </div>
  );
};

export default Players;
