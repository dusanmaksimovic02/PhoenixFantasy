import { useQuery } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { getGames } from "../../services/GameService";
import type { Game } from "@/models/Game";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditGameModal from "./EditGameModal";
import DeleteGameModal from "./DeleteGameModal";
import Loading from "../Loading";

const AllGames: FC = () => {
  const [isOpenEditGame, setIsOpenEditGame] = useState<boolean>(false);
  const [isOpenDeleteGame, setIsOpenDeleteGame] = useState<boolean>(false);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<Game>();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <h3 className="mb-8 text-center text-phoenix">All Games</h3>
      <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
        <table className="table w-full bg-white dark:bg-neutral-800">
          <thead className="bg-neutral-200 dark:bg-neutral-900">
            <tr>
              <th>ID</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Date</th>
              <th>Time</th>
              <th>Venue</th>
              <th>Referee</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game: Game) => (
              <tr
                key={game.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
              >
                <td className="text-xs">{game.id}</td>
                <td>{game.homeTeam.name}</td>
                <td>{game.guestTeam.name}</td>
                <td>{game.dateTime?.split("T")[0]} </td>
                <td>{game.dateTime?.split("T")[1]?.slice(0, 5)}</td>
                <td>{game.venue}</td>
                <td>{`${game.referee.firstName} ${game.referee.lastName}`}</td>
                <td>
                  <div className="flex justify-center gap-4">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsOpenEditGame(true);
                        setSelectedGame(game);
                      }}
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsOpenDeleteGame(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditGameModal
        isOpen={isOpenEditGame}
        setIsOpen={setIsOpenEditGame}
        gameId={selectedGameId}
        game={selectedGame!}
      />

      <DeleteGameModal
        isOpen={isOpenDeleteGame}
        setIsOpen={setIsOpenDeleteGame}
        gameId={selectedGameId}
      />
    </div>
  );
};

export default AllGames;
