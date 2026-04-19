import { toast } from "react-toastify";
import { useAuth } from "../../context/auth/useAuth";
import {
  getLeagueAdmin,
  isDraftStarted,
  startDraft,
} from "../../services/CreateDraftLeagueService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC } from "react";

interface StartDraftProps {
  leagueId: string;
}

const StartDraft: FC<StartDraftProps> = ({ leagueId }) => {
  const { id } = useAuth();

  const { data: leagueAdminId } = useQuery({
    queryKey: ["leagueAdminId"],
    queryFn: () => getLeagueAdmin(leagueId),
  });

  const { data: isLeagueStarted } = useQuery({
    queryKey: ["isLeagueStarted"],
    queryFn: () => isDraftStarted(leagueId),
  });

  const startDraftMutation = useMutation({
    mutationFn: async () => startDraft(leagueId),
    onSuccess: () => {
      toast.success("Successfully started draft league!");
    },
    onError: (err) => {
      toast.error("Error while starting draft league!");
      console.error(err);
    },
  });

  return (
    <>
      {leagueAdminId == id && !isLeagueStarted && (
        <div className="border-2 rounded-2xl gap-5 flex flex-col p-5 text-center max-md:w-fit max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
          <h5 className="max-md:text-sm">Start Draft</h5>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <select
            className={`select select-bordered w-full  bg-neutral-300 dark:bg-neutral-700  focus:outline-black dark:focus:outline-white max-md:w-fit`}
          >
            <option className="max-md:text-sm" value="">
              Select Player Order
            </option>
            <option className="max-md:text-sm" value={1}>
              Random
            </option>
            <option className="max-md:text-sm" value={2}>
              Earliest joined
            </option>
            <option className="max-md:text-sm" value={3}>
              Latest joined
            </option>
            <option className="max-md:text-sm" value={4}>
              Name ascending
            </option>
            <option className="max-md:text-sm" value={5}>
              Name descending
            </option>
          </select>
        </div>
      </div> */}
          <button
            type="submit"
            className="px-10 py-3 rounded text-white font-semibold bg-phoenix/60 hover:bg-phoenix/95 transition-all cursor-pointer disabled:opacity-50 w-full max-md:w-fit max-md:px-3 max-md:text-sm"
            onClick={() => startDraftMutation.mutate()}
          >
            Start Draft
          </button>
        </div>
      )}
    </>
  );
};

export default StartDraft;
