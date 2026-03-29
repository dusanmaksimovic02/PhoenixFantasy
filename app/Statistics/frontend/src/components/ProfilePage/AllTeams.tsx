import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../../services/TeamService";
import { useState, type FC } from "react";
import Loading from "../Loading";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditCoachModal from "./EditCoachModal";
import EditPlayersModal from "./EditPlayersModal";
import DeleteGameModal from "./DeleteGameModal";

const AllTeams: FC = () => {
  const [isOpenCoach, setIsOpenCoach] = useState(false);
  const [isOpenPlayers, setIsOpenPlayers] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isOpenDeleteGame, setIsOpenDeleteGame] = useState<boolean>(false);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-center text-phoenix">
        All Teams
      </h1>

      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800 text-nowrap">
          <thead className="bg-neutral-200 dark:bg-neutral-900">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Coach</th>
              <th>Players</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>
                  <div className="h-full flex gap-2 items-center justify-center">
                    <span>
                      {team.coach.firstName} {team.coach.lastName}{" "}
                    </span>
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setIsOpenCoach(true);
                        setSelectedTeamId(team.id);
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="h-full flex gap-2 items-center justify-center">
                    <span>Edit players</span>
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setIsOpenPlayers(true);
                        setSelectedTeamId(team.id);
                      }}
                    />
                  </div>
                </td>
                <td className="flex justify-center">
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setIsOpenDeleteGame(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditCoachModal
        teamId={selectedTeamId}
        setIsOpen={() => setIsOpenCoach(false)}
        isOpen={isOpenCoach}
      />

      <EditPlayersModal
        teamId={selectedTeamId}
        setIsOpen={() => setIsOpenPlayers(false)}
        isOpen={isOpenPlayers}
      />

      <DeleteGameModal
        isOpen={isOpenDeleteGame}
        setIsOpen={(isOpen) => setIsOpenDeleteGame(isOpen)}
        gameId={selectedTeamId}
      />
    </div>
  );
};

export default AllTeams;
