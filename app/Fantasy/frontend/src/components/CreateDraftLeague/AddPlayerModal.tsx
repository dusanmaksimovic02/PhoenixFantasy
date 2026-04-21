import type { Player } from "../../models/Player";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import jersey from "../../assets/images/jersey.png";
import { pickPlayer } from "../../services/CreateDraftLeagueService";
import { toast } from "react-toastify";
import { useDraft } from "../../context/draft/useDraft";

interface AddPlayerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: string;
  draftId: string;
  teamId: string;
}

const AddPlayerModal: FC<AddPlayerModalProps> = ({
  isOpen,
  setIsOpen,
  position,
  teamId,
  draftId,
}) => {
  const { availablePlayers } = useDraft();

  const addPlayerMutation = useMutation({
    mutationFn: (playerId: string) => pickPlayer(draftId, teamId, playerId),
    onSuccess: () => {
      toast.success("Player picked successfully!");
      setIsOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error while picking player");
    },
  });

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-gray-200 dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-white hover:text-black dark:bg-neutral-800 dark:hover:text-white dark:hover:border-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <h1 className="text-phoenix text-center">
          Select Player to add to your team
        </h1>

        <div className=" flex gap-3 overflow-x-auto flex-wrap">
          {availablePlayers
            .filter((p) => p.position == position)
            .map((p: Player) => (
              <div
                id={p.id}
                className="relative w-25 h-30  shrink-0 cursor-pointer"
                onClick={() =>
                  !addPlayerMutation.isPending && addPlayerMutation.mutate(p.id)
                }
              >
                <img src={jersey} alt="jersey image" className="w-25 h-30" />
                <div className="absolute inset-0 w-full h-full  text-black flex flex-col justify-center items-center gap-3 pt-8.5">
                  <p className="text-[15.5px] text-center font-extrabold">
                    {p.jerseyNumber}
                  </p>
                  <p className="text-[13px] text-center">
                    {p.firstName.charAt(0)}. {p.lastName}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </dialog>
  );
};

export default AddPlayerModal;
