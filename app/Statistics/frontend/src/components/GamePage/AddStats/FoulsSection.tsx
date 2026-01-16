import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { StatsState } from "../../../models/Stats";
import type { Action } from "@/models/reducer";

type Props = {
  stats: StatsState;
  dispatch: React.Dispatch<Action>;
};

const FoulsSection: FC<Props> = ({ stats, dispatch }) => {
  return (
    <div className="p-3 pr-0 w-full">
      <p className="text-phoenix">Fouls</p>
      <div className="flex justify-between px-8 pt-3">
        {(["committed", "drawn"] as const).map((kind) => (
          <div key={kind} className="flex flex-col justify-center items-center">
            <div className="flex gap-3">
              <p>{kind === "committed" ? "Committed" : "Drawn"}</p>
              <p>{stats.fouls[kind]}</p>
            </div>

            <PlusMinusButtons
              onPlusClick={() =>
                dispatch({
                  type: "foul",
                  payload: { kind, delta: 1 },
                })
              }
              onMinusClick={() =>
                dispatch({
                  type: "foul",
                  payload: { kind, delta: -1 },
                })
              }
              minusDisable={() => stats.fouls[kind] <= 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoulsSection;
