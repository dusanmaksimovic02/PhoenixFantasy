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

const ReboundsSection: FC<Props> = (props) => {
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
    <div className="p-3 pr-0 w-full">
      <div className="flex gap-10">
        <p className="text-phoenix">Rebounds</p>
        <p>{props.playerStats.rebounds}</p>
      </div>
      <div className="flex justify-between px-8 pt-3">
        {/* {(["offensive", "defensive"] as const).map((kind) => (
          <div key={kind} className="flex flex-col justify-center items-center">
            <div className="flex gap-3">
              <p>{kind === "offensive" ? "Offensive" : "Defensive"}</p>
              <p>{stats.rebounds[kind]}</p>
            </div>

            <PlusMinusButtons
              onPlusClick={() => }
              onMinusClick={() => dispatch({
                type: "rebound",
                payload: { kind, delta: -1 },
              })}
              minusDisable={() => stats.rebounds[kind] <= 0} plusDisabled={function (): boolean {
                throw new Error("Function not implemented.");
              } }            />
          </div>
        ))} */}

        <div
          key={"defensive"}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex gap-3">
            <p>Defensive</p>
            <p>{props.playerStats.defensiveRebounds}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([
                { statType: 10, delta: 1 },
                // { statType: 0, delta: 2 },
              ])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([
                { statType: 10, delta: -1 },
                // { statType: 0, delta: -2 },
              ])
            }
            minusDisable={() =>
              !(props.playerStats.defensiveRebounds > 0) ||
              updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>

        <div
          key={"defensive"}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex gap-3">
            <p>Offensive</p>
            <p>{props.playerStats.offensiveRebounds}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={() =>
              updateStatsMutation.mutate([
                { statType: 9, delta: 1 },
                // { statType: 0, delta: 2 },
              ])
            }
            onMinusClick={() =>
              updateStatsMutation.mutate([
                { statType: 9, delta: -1 },
                // { statType: 0, delta: -2 },
              ])
            }
            minusDisable={() =>
              !(props.playerStats.offensiveRebounds > 0) ||
              updateStatsMutation.isPending
            }
            plusDisabled={() => updateStatsMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default ReboundsSection;
