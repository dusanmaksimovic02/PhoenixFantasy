import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Player } from "../../models/Player";
import type { FC } from "react";
import {
  getTeamNonStartersFromGame,
  updateStarter,
} from "../../services/LiveGameService";
import { toast } from "react-toastify";
import Loading from "../Loading";

type Props = {
  isOpenChange: boolean;
  setIsOpenChange: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: string;
  time: Date;
  selectedPlayer: Player;
  gameId: string;
  teamId: string;
};

const tableHead = ["Name", "Surname", "Position", "JN"];

const ChangePlayer: FC<Props> = ({
  isOpenChange,
  setIsOpenChange,
  name,
  surname,
  position,
  jerseyNumber,
  selectedPlayer,
  gameId,
  teamId,
}) => {
  const queryClient = useQueryClient();
  const { data: teamNonStarters = [], isLoading } = useQuery({
    queryKey: ["teamNonStarters", teamId, gameId],
    queryFn: () => getTeamNonStartersFromGame(teamId, gameId),
  });

  const changeStarterMutation = useMutation({
    mutationFn: (newStarter: string) =>
      updateStarter(gameId, selectedPlayer.id, newStarter),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homeTeamStarters", teamId, gameId],
      });
      queryClient.invalidateQueries({
        queryKey: ["guestTeamStarters", teamId, gameId],
      });
      toast.success("Player changed successfully!");
      setIsOpenChange(false);
    },
    onError: () => toast.error("Error changing player"),
  });

  return (
    <dialog open={isOpenChange} className="modal">
      <div className="modal-box flex flex-col justify-center items-center bg-surface-light dark:bg-surface-dark rounded-4xl w-5/12 max-w-5xl ">
        <div className="modal-action text flex flex-col w-full">
          <button
            type="button"
            className="btn btn-sm text-red-600 btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setIsOpenChange(false);
            }}
          >
            ✕
          </button>

          <h3 className="text-nowrap w-full text-center">Change player</h3>

          <div
            className="w-full flex items-center gap-10 p-5 border-[3px] border-surface rounded-4xl"
            onClick={() => setIsOpenChange(true)}
          >
            <div className="bg-jersey bg-contain bg-no-repeat h-20 w-15 flex justify-center items-center">
              <p className="text-black pt-4 pr-1 font-bold text-xl">
                {jerseyNumber.toString()}
              </p>
            </div>
            <div className="flex w-full justify-between items-center">
              <div>
                <p className="text-phoenix">
                  {name} {surname}
                </p>
                <p>{position}</p>
              </div>
              {/* <div className="">
                <p>Time played</p>
                <p>{time.toLocaleTimeString()}</p>
              </div> */}
            </div>
          </div>

          <div className="w-full h-fit rounded-4xl border border-surface overflow-x-auto">
            <table className="w-full rounded-4xl ">
              <thead className="border-[3px] border-surface bg-surface-light text-lg font-medium text-foreground rounded-4xl  dark:bg-surface-dark">
                <tr>
                  {tableHead.map((head) => (
                    <th
                      key={head}
                      className="px-2.5 py-2  text-start  font-medium rounded-4xl "
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-black dark:text-white rounded-4xl ">
                {isLoading ? (
                  <Loading />
                ) : (
                  teamNonStarters.map((player) => (
                    <tr
                      key={player.id}
                      className="border-[3px] border-surface whitespace-nowrap rounded-4xl cursor-pointer"
                      onClick={() => changeStarterMutation.mutate(player.id)}
                    >
                      {/* <td className="p-3">{player.id}</td> */}
                      <td className="p-3 ">{player.firstName}</td>
                      <td className="p-3">{player.lastName}</td>
                      <td className="p-3">{player.position}</td>
                      <td className="p-3">{player.jerseyNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ChangePlayer;
