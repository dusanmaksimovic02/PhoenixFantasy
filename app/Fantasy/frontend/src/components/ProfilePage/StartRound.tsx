import { endRound, startRound } from "../../services/ManagerService";
import { getCurrentRound } from "../../services/FantasyLeagueService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { toast } from "react-toastify";

const StartRound: FC = () => {
  const queryClient = useQueryClient();

  const { data: league } = useQuery({
    queryKey: ["league"],
    queryFn: getCurrentRound,
  });

  const startRoundMutation = useMutation({
    mutationFn: startRound,
    onSuccess: () => {
      toast.success("Round started successfully!");
      queryClient.invalidateQueries({ queryKey: ["league"] });
    },
    onError: (e: Error) => {
      console.error("Error starting round:", e);
      toast.error("Failed to start round. Please try again.");
    },
  });

  const endRoundMutation = useMutation({
    mutationFn: endRound,
    onSuccess: () => {
      toast.success("Round ended successfully!");
      queryClient.invalidateQueries({ queryKey: ["league"] });
    },
    onError: (e: Error) => {
      console.error("Error ending round:", e);
      toast.error("Failed to end round. Please try again.");
    },
  });

  return (
    <div className="flex flex-col gap-5 bg-surface-light dark:bg-surface-dark p-10 rounded-3xl">
      {league && (
        <>
          <h1>Current Round: {league.currentRound}</h1>
          {league && league.isRoundActive ? (
            <strong>Round is active</strong>
          ) : (
            <strong>Round is not active</strong>
          )}
        </>
      )}
      <div className="flex justify-between gap-5">
        <button
          className="w-fit bg-phoenix hover:border-phoenix cursor-pointer hover:bg-phoenix/80 hover:border-2 p-2 rounded-md font-bold"
          disabled={league && league.isRoundActive}
          onClick={() => startRoundMutation.mutate()}
        >
          Start Round
        </button>
        <button
          className="w-fit bg-phoenix hover:border-phoenix cursor-pointer hover:bg-phoenix/80 hover:border-2 p-2 rounded-md font-bold"
          disabled={league && !league.isRoundActive}
          onClick={() => endRoundMutation.mutate()}
        >
          End Round
        </button>
      </div>
    </div>
  );
};

export default StartRound;
