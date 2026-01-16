import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { StatsState } from "../../../models/Stats";
import type { Action } from "../../../models/reducer";

type Props = {
  stats: StatsState;
  dispatch: React.Dispatch<Action>;
};

const ReboundsSection: FC<Props> = ({ stats, dispatch }) => {
  return (
    <div className="p-3 pr-0 w-full">
      <div className="flex gap-10">
        <p className="text-phoenix">Rebounds</p>
        <p>{stats.rebounds.total}</p>
      </div>
      <div className="flex justify-between px-8 pt-3">
        {(["offensive", "defensive"] as const).map((kind) => (
          <div key={kind} className="flex flex-col justify-center items-center">
            <div className="flex gap-3">
              <p>{kind === "offensive" ? "Offensive" : "Defensive"}</p>
              <p>{stats.rebounds[kind]}</p>
            </div>

            <PlusMinusButtons
              onPlusClick={() =>
                dispatch({
                  type: "rebound",
                  payload: { kind, delta: 1 },
                })
              }
              onMinusClick={() =>
                dispatch({
                  type: "rebound",
                  payload: { kind, delta: -1 },
                })
              }
              minusDisable={() => stats.rebounds[kind] <= 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReboundsSection;
