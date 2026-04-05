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

const PointsSection: FC<Props> = (props) => {
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
    <div className="flex">
      <div className="p-3 w-full">
        <div className="flex gap-10">
          <p className="text-phoenix">Points</p>
          <p>{props.playerStats.points}</p>
        </div>
        <div className="px-3 flex justify-between">
          <p></p>
          <div>
            <p>1pts</p>
            <p>
              {props.playerStats.made1p}/
              {props.playerStats.made1p + props.playerStats.miss1p}
            </p>
          </div>
          <div>
            <p className="-translate-x-3">2pts</p>
            <p className="-translate-x-3">
              {props.playerStats.made2p}/
              {props.playerStats.made2p + props.playerStats.miss2p}
            </p>
          </div>
          <div>
            <p className="-translate-x-6">3pts</p>
            <p className="-translate-x-6">
              {props.playerStats.made3p}/
              {props.playerStats.made3p + props.playerStats.miss3p}
            </p>
          </div>
        </div>
        <div className="p-3 flex justify-between items-center">
          <p className="w-10">Made</p>
          <PlusMinusButtons
            key={1}
            onPlusClick={() =>
              updateStatsMutation.mutate([
                { statType: 1, delta: 1 },
                // { statType: 0, delta: 1 },
              ])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([
                { statType: 1, delta: -1 },
                // { statType: 0, delta: -1 },
              ])
            }
            minusDisable={() =>
              !(props.playerStats.made1p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
          <PlusMinusButtons
            key={3}
            onPlusClick={() =>
              updateStatsMutation.mutate([
                { statType: 3, delta: 1 },
                // { statType: 0, delta: 2 },
              ])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([
                { statType: 3, delta: -1 },
                // { statType: 0, delta: -2 },
              ])
            }
            minusDisable={() =>
              !(props.playerStats.made2p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
          <PlusMinusButtons
            key={5}
            onPlusClick={() =>
              updateStatsMutation.mutate([
                { statType: 5, delta: 1 },
                // { statType: 0, delta: 3 },
              ])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([
                { statType: 5, delta: -1 },
                // { statType: 0, delta: -3 },
              ])
            }
            minusDisable={() =>
              !(props.playerStats.made3p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>
        <div className="p-3 pt-0 flex justify-between items-center">
          <p className="w-10">Attempt</p>
          <PlusMinusButtons
            key={2}
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 2, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 2, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.miss1p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
          <PlusMinusButtons
            key={4}
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 4, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 4, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.miss2p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
          <PlusMinusButtons
            key={6}
            onPlusClick={() =>
              updateStatsMutation.mutate([{ statType: 6, delta: 1 }])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([{ statType: 6, delta: -1 }])
            }
            minusDisable={() =>
              !(props.playerStats.miss2p > 0) || updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default PointsSection;
