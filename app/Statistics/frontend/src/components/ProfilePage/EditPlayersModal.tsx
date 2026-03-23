import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Player } from "../../models/Player";
import { useState, type FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import {
  addPlayersToTeam,
  getTeams,
  removePlayerFromTeam,
} from "../../services/TeamService";
import { toast } from "react-toastify";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { getFreePlayers } from "../../services/PlayerService";

interface EditPlayersModalProps {
  //   team: Team;
  teamId: string;
  setIsOpen: () => void;
  isOpen: boolean;
}

const EditPlayersModal: FC<EditPlayersModalProps> = (props) => {
  const queryClient = useQueryClient();

  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const team = teams.find((t) => t.id === props.teamId);

  const removePlayerMutation = useMutation({
    mutationFn: () => removePlayerFromTeam(props.teamId, selectedPlayer!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["freePlayers"] });
      toast.success("Player removed from team successfully");
    },
    onError: (e) => {
      toast.error("Remove player failed");
      console.log(e);
    },
  });

  const addNewPlayersMutation = useMutation({
    mutationFn: () =>
      addPlayersToTeam(
        props.teamId,
        selectedPlayers.map((p) => p.id),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["freePlayers"] });
      setSelectedPlayers([]);
      toast.success("Players added to team successfully");
    },
    onError: (e) => {
      toast.error("Add players failed");
      console.log(e);
    },
  });

  const { data: players = [] } = useQuery({
    queryKey: ["freePlayers"],
    queryFn: getFreePlayers,
  });

  const togglePlayer = (player: Player) => {
    const isSelected = selectedPlayers.some((p) => p.id === player.id);
    const newVal = isSelected
      ? selectedPlayers.filter((p) => p.id !== player.id)
      : [...selectedPlayers, player];
    setSelectedPlayers(newVal);
  };

  return (
    <dialog open={props.isOpen} className="modal">
      <div className="modal-box w-11/12 max-w-5xl bg-white dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => props.setIsOpen()}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-phoenix text-center mb-6">
          Edit {team?.name} Players
        </h3>

        <div className="overflow-auto h-max-70 rounded-xl border border-neutral-300 dark:border-neutral-700">
          <table className="table bg-white dark:bg-neutral-800">
            <thead className="bg-neutral-200 dark:bg-neutral-900">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Birth Date</th>
                <th>JN</th>
                <th className="text-center">Remove Player</th>
              </tr>
            </thead>
            <tbody>
              {team?.players.map((player: Player) => (
                <tr
                  key={player.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  <td className="text-xs text-nowrap">{player.id}</td>
                  <td>{player.firstName}</td>
                  <td>{player.lastName}</td>
                  <td>{player.dateOfBirth.split("T")[0]}</td>
                  <td>
                    <span className="badge badge-ghost font-bold">
                      {player.jerseyNumber}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-4">
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                        onClick={() => {
                          setSelectedPlayer(player);
                          removePlayerMutation.mutate();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <label className="block mb-1 font-medium">Select new players</label>
          <div className="dropdown w-full cursor-pointer">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
            >
              Select players ({selectedPlayers.length}) <IoIosArrowDown />
            </div>
            <div
              tabIndex={0}
              className="dropdown-content p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
            >
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>JN</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => togglePlayer(p)}
                      className={`cursor-pointer ${selectedPlayers.some((sp) => sp.id === p.id) ? "bg-phoenix" : ""}`}
                    >
                      <td>
                        {p.firstName} {p.lastName}
                      </td>
                      <td>{p.jerseyNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-5">
          {selectedPlayers.map((p) => (
            <span
              key={p.id}
              className="flex gap-1 bg-phoenix px-3 py-1 rounded-full text-xs"
            >
              {p.firstName} {p.lastName}
              <IoIosClose
                className="cursor-pointer w-4 h-4"
                onClick={() => togglePlayer(p)}
              />
            </span>
          ))}
        </div>

        <button
          type="submit"
          className="btn w-full bg-green-600 hover:bg-green-700 text-white mt-5"
          onClick={() => addNewPlayersMutation.mutate()}
          disabled={
            selectedPlayers.length === 0 || addNewPlayersMutation.isPending
          }
        >
          {addNewPlayersMutation.isPending ? "Saving..." : "Save New Players"}
        </button>
      </div>
    </dialog>
  );
};

export default EditPlayersModal;
