import { useState, type FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllFreeCoaches } from "../../services/CoachService";
import type { Coach } from "../../models/Coach";
import { toast } from "react-toastify";
import { getTeams, updateTeamCoach } from "../../services/TeamService";

interface EditTeamCoachModalProps {
  teamId: string;
  setIsOpen: () => void;
  isOpen: boolean;
}

const EditTeamCoachModal: FC<EditTeamCoachModalProps> = (props) => {
  const queryClient = useQueryClient();
  const [selectedCoach, setSelectedCoach] = useState<Coach>();

  const { data: coaches = [] } = useQuery({
    queryKey: ["freeCoaches"],
    queryFn: getAllFreeCoaches,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const team = teams.find((t) => t.id === props.teamId);

  const updateCoachMutation = useMutation({
    mutationFn: () => updateTeamCoach(props.teamId, selectedCoach!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["freeCoaches"] });
      toast.success("Team Coach updated successfully");
    },
    onError: () => toast.error("Update coach failed"),
  });

  return (
    <dialog open={props.isOpen} className="modal">
      <div className="modal-box bg-white dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-white hover:text-black dark:bg-neutral-800 dark:hover:text-white dark:hover:border-white"
          onClick={() => props.setIsOpen()}
        >
          ✕
        </button>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-phoenix text-center mb-6">
            Change Coach
          </h3>

          {team?.coach && (
            <p className="mt-4">
              Current Coach of {team?.name} is {team?.coach.firstName}{" "}
              {team?.coach.lastName}
            </p>
          )}

          <div className="dropdown w-full mt-10">

            <select
              className={`select select-bordered w-full bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white`}
            >
              <option value="">Select Team Coach</option>
              {coaches.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  selected={c?.id === c.id}
                  onClick={() => {
                    setSelectedCoach(c);
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                >
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-white mt-20 border-none"
            onClick={() => updateCoachMutation.mutate()}
            disabled={
              selectedCoach === undefined ||
              updateCoachMutation.isPending ||
              (team?.coach && selectedCoach?.id === team?.coach.id)
            }
          >
            {updateCoachMutation.isPending ? "Saving..." : "Save New Coach"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditTeamCoachModal;
