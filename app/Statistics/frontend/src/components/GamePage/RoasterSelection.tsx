import { getTeamPlayers } from "../../services/TeamService";
import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { FaCheckCircle, FaRegCircle, FaRegStar, FaStar } from "react-icons/fa";
import Loading from "../Loading";

interface RoasterSelectionProps {
  teamId: string;
  selectedIds: string[];
  starterIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setStarterIds: (ids: string[]) => void;
}

const RoasterSelection: FC<RoasterSelectionProps> = ({
  teamId,
  selectedIds,
  starterIds,
  setSelectedIds,
  setStarterIds,
}) => {
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["teamPlayers", teamId],
    queryFn: () => getTeamPlayers(teamId),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
      <table className="table w-full">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-900 text-phoenix">
            <th>JN</th>
            <th>Player</th>
            <th>Position</th>
            <th className="text-center">In 12</th>
            <th className="text-center">Starter</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isInRoster = selectedIds.includes(player.id);
            const isStarter = starterIds.includes(player.id);

            return (
              <tr
                key={player.id}
                className={
                  isInRoster ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                }
              >
                <td>{player.jerseyNumber}</td>
                <td
                  className={`font-medium ${isStarter ? "text-blue-600 dark:text-blue-400 font-bold" : ""}`}
                >
                  {player.firstName} {player.lastName}
                  {isStarter && (
                    <span className="ml-2 p-1 badge badge-sm badge-primary">
                      5
                    </span>
                  )}
                </td>

                <td>position</td>

                <td className="text-center">
                  <button
                    disabled={selectedIds.length >= 12}
                    onClick={() => {
                      setSelectedIds(
                        selectedIds.includes(player.id)
                          ? selectedIds.filter((id) => id != player.id)
                          : [...selectedIds, player.id],
                      );
                      setStarterIds(starterIds.filter((id) => id != player.id));
                    }}
                    className={`text-2xl transition-all hover:scale-110 ${isInRoster ? "text-green-500" : "text-neutral-300"}`}
                  >
                    {isInRoster ? <FaCheckCircle /> : <FaRegCircle />}
                  </button>
                </td>

                <td className="text-center">
                  <button
                    disabled={!isInRoster || starterIds.length === 5}
                    onClick={() =>
                      setStarterIds(
                        starterIds.includes(player.id)
                          ? starterIds.filter((id) => id != player.id)
                          : starterIds.length === 5
                            ? [...starterIds]
                            : [...starterIds, player.id],
                      )
                    }
                    className={`text-2xl transition-all ${!isInRoster ? "opacity-20 cursor-not-allowed" : "hover:scale-110"} 
                    ${isStarter ? "text-yellow-500" : "text-neutral-300"}`}
                  >
                    {isStarter ? <FaStar /> : <FaRegStar />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoasterSelection;
