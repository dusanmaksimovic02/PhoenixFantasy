import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStats } from "../../../services/LiveGameService";
import type { Player } from "../../../models/Player";
import type { PlayerGameStats } from "../../../models/PlayerGameStats";

type Props = {
  gameId: string;
  selectedPlayer: Player;
  teamId: string;
  playerStats: PlayerGameStats;
  isLoading: boolean;
};

const FoulsSection: FC<Props> = (props) => {
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
    <div className="p-3 pr-0 w-full h-fit">
      <p className="text-phoenix">Fouls</p>
      <div className="flex justify-between px-8 h-fit">
        <div
          key={"Committed"}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex gap-3">
            <p>Committed</p>
            <p>{props.playerStats.personalFouls}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 14, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 14, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.personalFouls > 0) ||
              updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>

        <div
          key={"drawn"}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex gap-3">
            <p>Drawn</p>
            <p>{props.playerStats.recievedFouls}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 15, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 15, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.recievedFouls > 0) ||
              updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default FoulsSection;
