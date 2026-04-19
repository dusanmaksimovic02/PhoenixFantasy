import { useAuth } from "../../context/auth/useAuth";
import {
  deleteLeague,
  getLeagueAdmin,
} from "../../services/CreateDraftLeagueService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DeleteLeagueBoxProps {
  leagueId: string;
}

const DeleteLeagueBox: FC<DeleteLeagueBoxProps> = ({ leagueId }) => {
  const { id } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  const { data: leagueAdminId } = useQuery({
    queryKey: ["leagueAdminId"],
    queryFn: () => getLeagueAdmin(leagueId),
  });

  const deleteLeagueMutation = useMutation({
    mutationFn: async () => deleteLeague(leagueId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["userLeague", id],
      });
      console.log("Delete league " + res);
      toast.success("Successfully delete league!");
      setIsOpenDelete(false);
      navigate("/fantasy");
    },
    onError: (err) => {
      toast.error("Error while deleting league!");
      console.error(err);
    },
  });
  return (
    <>
      {leagueAdminId == id && (
        <div className="border-2 rounded-2xl gap-5 flex flex-col p-5 text-center max-sm:w-fit max-sm:h-fit">
          <h5 className="max-md:text-sm">Delete League?</h5>
          <button
            type="submit"
            className="px-10 py-3 rounded text-white font-semibold bg-red-500/60 hover:bg-red-500/95 transition-all cursor-pointer disabled:opacity-50 w-full max-md:w-fit max-md:px-3 max-md:text-sm"
            onClick={() => setIsOpenDelete(true)}
          >
            Delete League
          </button>
        </div>
      )}

      {leagueAdminId == id && isOpenDelete && (
        <dialog open={isOpenDelete} className="modal">
          <div className="modal-box bg-gray-200 dark:bg-neutral-800">
            <h3 className="font-bold text-lg text-center">Delete League?</h3>

            <p className="py-4 text-center">
              Are you sure you want to delete league? This action cannot be
              undone.
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
                onClick={() => deleteLeagueMutation.mutate()}
                disabled={deleteLeagueMutation.isPending}
              >
                {deleteLeagueMutation.isPending
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DeleteLeagueBox;
