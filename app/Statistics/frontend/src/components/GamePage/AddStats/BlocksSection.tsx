import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { StatsState } from "../../../models/Stats";
import type { Action } from "@/models/reducer";

type Props = {
  stats: StatsState;
  dispatch: React.Dispatch<Action>;
};

const BlocksSection: FC<Props> = ({ stats, dispatch }) => {
  return (
    <div className="p-3 pb-10 w-[35%]  border-r">
      <p className="text-phoenix">Blocks</p>
      <div className="flex flex-col justify-around h-full pl-3">
        {(
          [
            { field: "blocksFor", label: "For" },
            { field: "blocksAgainst", label: "Against" },
          ] as const
        ).map(({ field, label }) => (
          <div key={field} className="flex justify-between items-center">
            <div className="flex gap-2">
              <p>{label}</p>
              <p>{stats.defense[field]}</p>
            </div>

            <PlusMinusButtons
              onPlusClick={() =>
                dispatch({
                  type: "defense",
                  payload: { field, delta: 1 },
                })
              }
              onMinusClick={() =>
                dispatch({
                  type: "defense",
                  payload: { field, delta: -1 },
                })
              }
              minusDisable={() => stats.defense[field] <= 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocksSection;
