import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { Player } from "../../../models/Player";
import type { PlayerGameStats } from "../../../models/PlayerGameStats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStats } from "../../../services/LiveGameService";

type Props = {
  gameId: string;
  selectedPlayer: Player;
  teamId: string;
  playerStats: PlayerGameStats;
  isLoading: boolean;
};

const BlocksSection: FC<Props> = (props) => {
  const queryClient = useQueryClient();

  const updateStatsMutation = useMutation({
    mutationFn: (changes: { statType: number; delta: number }[]) =>
      updateStats(props.gameId, props.selectedPlayer.id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerStats"] });
      queryClient.invalidateQueries({ queryKey: ["teamPlayers"] });
    },
  });

  return (
    <div className="p-3 pb-10 w-[35%]  border-r">
      <p className="text-phoenix">Blocks</p>
      <div className="flex flex-col justify-around h-full pl-3">
        <div key={"blocks"} className="flex justify-between items-center">
          <div className="flex gap-2">
            <p>Blocks</p>
            <p>{props.playerStats.blocks}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 16, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 16, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.blocks > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>

        <div
          key={"receivedBlocks"}
          className="flex justify-between items-center"
        >
          <div className="flex gap-2">
            <p>Received Blocks</p>
            <p>{props.playerStats.recievedBlocks}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 17, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 17, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.recievedBlocks > 0) ||
              updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default BlocksSection;
