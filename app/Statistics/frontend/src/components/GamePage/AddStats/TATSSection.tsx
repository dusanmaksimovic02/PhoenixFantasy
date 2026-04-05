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

const TATSSection: FC<Props> = (props) => {
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
    <div className="w-[65%] grid grid-cols-[1.2fr_1fr] grid-rows-2 divide-x divide-y">
      <div key="technical" className="p-3 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <p className="text-phoenix">Technical</p>
          <p>{props.playerStats.technicalFouls}</p>
        </div>

        <PlusMinusButtons
          onPlusClick={() =>
            updateStatsMutation.mutate([{ statType: 18, delta: 1 }])
          }
          onMinusClick={() =>
            updateStatsMutation.mutate([{ statType: 18, delta: -1 }])
          }
          minusDisable={() =>
            !(props.playerStats.technicalFouls > 0) ||
            updateStatsMutation.isPending
          }
          plusDisabled={() => updateStatsMutation.isPending}
        />
      </div>

      <div key="assists" className="p-3 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <p className="text-phoenix">Assists</p>
          <p>{props.playerStats.assists}</p>
        </div>

        <PlusMinusButtons
          onPlusClick={() =>
            updateStatsMutation.mutate([{ statType: 7, delta: 1 }])
          }
          onMinusClick={() =>
            updateStatsMutation.mutate([{ statType: 7, delta: -1 }])
          }
          minusDisable={() =>
            !(props.playerStats.assists > 0) || updateStatsMutation.isPending
          }
          plusDisabled={() => updateStatsMutation.isPending}
        />
      </div>

      <div key="turnovers" className="p-3 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <p className="text-phoenix">Turnovers</p>
          <p>{props.playerStats.turnovers}</p>
        </div>

        <PlusMinusButtons
          onPlusClick={() =>
            updateStatsMutation.mutate([{ statType: 12, delta: 1 }])
          }
          onMinusClick={() =>
            updateStatsMutation.mutate([{ statType: 12, delta: -1 }])
          }
          minusDisable={() =>
            !(props.playerStats.turnovers > 0) || updateStatsMutation.isPending
          }
          plusDisabled={() => updateStatsMutation.isPending}
        />
      </div>

      <div key="steals" className="p-3 flex justify-between items-center">
        <div className="flex flex-col items-center">
          <p className="text-phoenix">Steals</p>
          <p>{props.playerStats.steals}</p>
        </div>

        <PlusMinusButtons
          onPlusClick={() =>
            updateStatsMutation.mutate([{ statType: 11, delta: 1 }])
          }
          onMinusClick={() =>
            updateStatsMutation.mutate([{ statType: 11, delta: -1 }])
          }
          minusDisable={() =>
            !(props.playerStats.steals > 0) || updateStatsMutation.isPending
          }
          plusDisabled={() => updateStatsMutation.isPending}
        />
      </div>
    </div>
  );
};

export default TATSSection;
