import { useState, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { deletePlayer, getPlayers } from "../../services/PlayerService";
import type { Player } from "../../models/Player";
import CustomTable from "./CustomTable";
import DeleteModal from "./DeleteModal";
import EditPlayerModal from "./EditPlayerModal";

const AllPlayers: FC = () => {
  const queryClient = useQueryClient();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted successfully");
      setIsOpenDelete(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full relative p-4">
      <CustomTable
        title={"All Players"}
        thead={[
          "ID",
          "First Name",
          "Last Name",
          "Position",
          "Birth Date",
          "JN",
          "Actions",
        ]}
        data={players}
        renderRow={(player: Player) => (
          <>
            <td className="text-xs">{player.id}</td>
            <td>{player.firstName}</td>
            <td>{player.lastName}</td>
            <td>{player.position ? player.position : ""}</td>
            <td>{player.dateOfBirth.split("T")[0]}</td>
            <td>{player.jerseyNumber}</td>
            <td>
              <div className="flex justify-center gap-4">
                <FaEdit
                  className="text-blue-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setIsOpenEdit(true);
                    setSelectedPlayer(player);
                  }}
                />
                <FaTrashAlt
                  className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                  onClick={() => {
                    setSelectedPlayer(player);
                    setIsOpenDelete(true);
                  }}
                />
              </div>
            </td>
          </>
        )}
      />

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate(selectedPlayer!.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Player?"
        description="Are you sure you want to delete this player? This action cannot be undone."
      />

      <EditPlayerModal
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        player={selectedPlayer!}
      />

      {deleteMutation.isPending && <Loading />}
    </div>
  );
};

export default AllPlayers;
