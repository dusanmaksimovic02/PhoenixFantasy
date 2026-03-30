import { removeCoachFromTeam } from "../../services/TeamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { toast } from "react-toastify";

interface RemoveCoachFromTeamProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamId: string;
}

const RemoveCoachFromTeamModal: FC<RemoveCoachFromTeamProps> = ({
  isOpen,
  setIsOpen,
  teamId,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeCoachFromTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["freeCoaches"] });
      toast.success("Coach removed from team successfully");
      setIsOpen(false);
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">
          Remove Coach from Team?
        </h3>
        <p className="py-4 text-center">
          Are you sure you want to remove the coach from this team?
        </p>
        <div className="modal-action flex justify-around">
          <button className="btn btn-outline" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-error text-white"
            onClick={() => deleteMutation.mutate(teamId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Removing..." : "Remove Coach"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RemoveCoachFromTeamModal;
