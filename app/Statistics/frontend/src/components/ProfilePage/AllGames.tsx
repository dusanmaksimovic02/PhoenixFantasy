import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { deleteGame, getGames } from "../../services/GameService";
import type { Game } from "../../models/Game";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditGameModal from "./EditGameModal";
import Loading from "../Loading";
import CustomTable from "./CustomTable";
import DeleteModal from "./DeleteModal";
import { toast } from "react-toastify";

const AllGames: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenEditGame, setIsOpenEditGame] = useState<boolean>(false);
  const [isOpenDeleteGame, setIsOpenDeleteGame] = useState<boolean>(false);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<Game>();

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Game deleted successfully");
      setIsOpenDeleteGame(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <CustomTable
        title={"All Games"}
        thead={[
          "ID",
          "Home Team",
          "Away Team",
          "Date",
          "Time",
          "Venue",
          "Round",
          "Referee",
          "Actions",
        ]}
        data={games}
        renderRow={(game: Game) => (
          <>
            <td>{game.id}</td>
            <td>{game.homeTeam.name}</td>
            <td>{game.guestTeam.name}</td>
            <td>{game.dateTime?.split("T")[0]}</td>
            <td>{game.dateTime?.split("T")[1]?.slice(0, 5)}</td>
            <td>{game.venue}</td>
            <td>{game.round}</td>
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
          </>
        )}
      ></CustomTable>

      <EditGameModal
        isOpen={isOpenEditGame}
        setIsOpen={setIsOpenEditGame}
        gameId={selectedGameId}
        game={selectedGame!}
      />

      <DeleteModal
        isOpen={isOpenDeleteGame}
        onClose={() => setIsOpenDeleteGame(false)}
        onConfirm={() => deleteMutation.mutate(selectedGameId)}
        isLoading={deleteMutation.isPending}
        title="Delete Game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
      />
    </div>
  );
};

export default AllGames;
