import { useState, type FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoaches } from "../../services/CoachService";
import { IoIosArrowDown } from "react-icons/io";
import type { Coach } from "../../models/Coach";
import { toast } from "react-toastify";
import { getTeams, updateTeamCoach } from "../../services/TeamService";

interface EditCoachModalProps {
  teamId: string;
  setIsOpen: () => void;
  isOpen: boolean;
}

const EditCoachModal: FC<EditCoachModalProps> = (props) => {
  const queryClient = useQueryClient();
  const [selectedCoach, setSelectedCoach] = useState<Coach>();

  const { data: coaches = [] } = useQuery({
    queryKey: ["coaches"],
    queryFn: getCoaches,
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
      toast.success("Team Coach updated successfully");
    },
    onError: () => toast.error("Update coach failed"),
  });

  return (
    <dialog open={props.isOpen} className="modal">
      <div className="modal-box bg-white dark:bg-neutral-800">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => props.setIsOpen()}
        >
          ✕
        </button>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-phoenix text-center mb-6">
            Change Coach
          </h3>

          <p className="mt-4">
            Current Coach of {team?.name} is {team?.coach.firstName}{" "}
            {team?.coach.lastName}
          </p>

          <div className="dropdown w-full mt-10">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-300"
            >
              {selectedCoach
                ? `${selectedCoach.firstName} ${selectedCoach.lastName}`
                : "Select a coach"}{" "}
              <IoIosArrowDown />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto z-10"
            >
              {coaches.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setSelectedCoach(c);
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                >
                  <a>
                    {c.firstName} {c.lastName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-white mt-20"
            onClick={() => updateCoachMutation.mutate()}
            disabled={
              selectedCoach === undefined ||
              updateCoachMutation.isPending ||
              selectedCoach?.id === team?.coach.id
            }
          >
            {updateCoachMutation.isPending ? "Saving..." : "Save New Coach"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditCoachModal;
