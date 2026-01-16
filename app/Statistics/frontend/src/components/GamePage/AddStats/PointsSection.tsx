import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { StatsState } from "../../../models/Stats";
import type { Action } from "../../../models/reducer";

type Props = {
  stats: StatsState;
  dispatch: React.Dispatch<Action>;
};

const PointsSection: FC<Props> = ({ stats, dispatch }) => {
  return (
    <div className="flex">
      <div className="p-3 w-full">
        <div className="flex gap-10">
          <p className="text-phoenix">Points</p>
          <p>{stats.shooting.points}</p>
        </div>
        <div className="px-3 flex justify-between">
          <p></p>
          <div>
            <p>1pts</p>
            <p>
              {stats.shooting.oneMade}/{stats.shooting.oneAttempt}
            </p>
          </div>
          <div>
            <p className="-translate-x-3">2pts</p>
            <p className="-translate-x-3">
              {stats.shooting.twoMade}/{stats.shooting.twoAttempt}
            </p>
          </div>
          <div>
            <p className="-translate-x-6">3pts</p>
            <p className="-translate-x-6">
              {stats.shooting.threeMade}/{stats.shooting.threeAttempt}
            </p>
          </div>
        </div>
        <div className="p-3 flex justify-between items-center">
          <p className="w-10">Made</p>
          {(["one", "two", "three"] as const).map((kind) => (
            <PlusMinusButtons
              key={kind}
              onPlusClick={() =>
                dispatch({
                  type: "shoot",
                  payload: { kind, made: true },
                })
              }
              onMinusClick={() =>
                dispatch({
                  type: "undoShoot",
                  payload: { kind, made: true },
                })
              }
              minusDisable={() => {
                return (
                  stats.shooting[
                    `${kind}Made` as keyof typeof stats.shooting
                  ] <= 0
                );
              }}
            />
          ))}
        </div>
        <div className="p-3 pt-0 flex justify-between items-center">
          <p className="w-10">Attempt</p>
          {(["one", "two", "three"] as const).map((kind) => (
            <PlusMinusButtons
              key={kind}
              onPlusClick={() =>
                dispatch({
                  type: "shoot",
                  payload: { kind, made: false },
                })
              }
              onMinusClick={() =>
                dispatch({
                  type: "undoShoot",
                  payload: { kind, made: false },
                })
              }
              minusDisable={() => {
                return (
                  stats.shooting[
                    `${kind}Attempt` as keyof typeof stats.shooting
                  ] <= 0
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsSection;
