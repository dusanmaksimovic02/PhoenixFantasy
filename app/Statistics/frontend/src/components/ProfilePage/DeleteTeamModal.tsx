import { deleteTeam } from "../../services/TeamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { toast } from "react-toastify";

interface DeleteTeamModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamId: string;
}

const DeleteTeamModal: FC<DeleteTeamModalProps> = ({
  isOpen,
  setIsOpen,
  teamId: gameId,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team deleted successfully");
      setIsOpen(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">Delete Team?</h3>
        <p className="py-4 text-center">This action cannot be undone.</p>
        <div className="modal-action flex justify-around">
          <button className="btn btn-outline" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-error text-white"
            onClick={() => deleteMutation.mutate(gameId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteTeamModal;
