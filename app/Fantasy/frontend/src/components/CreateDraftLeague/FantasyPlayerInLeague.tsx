import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../context/auth/useAuth";
import type { User } from "../../models/User";
import {
  getFantasyLeagueParticipant,
  getLeagueAdmin,
  removeParticipantFromTeam,
} from "../../services/CreateDraftLeagueService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FantasyPlayerInLeagueProps {
  leagueId: string;
}

const FantasyPlayerInLeague: FC<FantasyPlayerInLeagueProps> = ({
  leagueId,
}) => {
  const { id } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const {
    data: leagueParticipant,
    isLoading: isLoadingParticipants,
    isFetching,
  } = useQuery({
    queryKey: ["leagueParticipant", leagueId],
    queryFn: () => getFantasyLeagueParticipant(leagueId),
    refetchInterval: 10000,
    staleTime: 0,
  });

  const { data: leagueAdminId } = useQuery({
    queryKey: ["leagueAdminId"],
    queryFn: () => getLeagueAdmin(leagueId),
  });

  const removeTeamFromLeagueMutation = useMutation({
    mutationFn: async (data: { userId: string; leagueId: string }) =>
      removeParticipantFromTeam(data.userId, data.leagueId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["leagueParticipant", leagueId],
      });
      console.log("Remove team from league " + res);
      toast.success("Successfully removed team from league!");
      setIsOpenDelete(false);
    },
    onError: (err) => {
      toast.error("Error while removing team from league!");
      console.error(err);
    },
  });

  useEffect(() => {
    if (isLoadingParticipants || isFetching) return;

    if (leagueParticipant && id && leagueAdminId) {
      if (id === leagueAdminId) return;

      const isParticipant = leagueParticipant.some((u: User) => u.id === id);

      if (!isParticipant) {
        toast.error("You have been removed from this league.");
        navigate("/fantasy");
      }
    }
  }, [
    leagueParticipant,
    id,
    isLoadingParticipants,
    isFetching,
    leagueAdminId,
    navigate,
  ]);
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700 max-md:col-span-2">
      <table className="table w-full bg-white dark:bg-neutral-800">
        <thead className="bg-neutral-200 text-neutral-700 dark:text-neutral-50 dark:bg-neutral-900">
          <tr>
            <th>#</th>
            <th>Username</th>
            {id == leagueAdminId && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {leagueParticipant &&
            leagueParticipant?.map((u: User, index) => (
              <tr
                key={u.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-nowrap"
              >
                <td>{index + 1}</td>
                <td>{u.userName}</td>
                {id == leagueAdminId && id != u.id && (
                  <td className="flex justify-center">
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:scale-120 transition-transform"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setIsOpenDelete(true);
                      }}
                    />
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      <dialog open={isOpenDelete} className="modal">
        <div className="modal-box bg-gray-200 dark:bg-neutral-800">
          <h3 className="font-bold text-lg text-center">Remove participant?</h3>

          <p className="py-4 text-center">
            Are you sure you want to remove this participant? This action cannot
            be undone.
          </p>

          <div className="modal-action flex justify-around">
            <button
              className="btn btn-outline "
              onClick={() => setIsOpenDelete(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-error text-white"
              onClick={() =>
                removeTeamFromLeagueMutation.mutate({
                  userId: selectedUserId,
                  leagueId: leagueId,
                })
              }
              disabled={removeTeamFromLeagueMutation.isPending}
            >
              {removeTeamFromLeagueMutation.isPending
                ? "Deleting..."
                : "Delete Permanently"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FantasyPlayerInLeague;
