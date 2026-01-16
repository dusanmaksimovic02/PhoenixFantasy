import type { FC } from "react";
import PlusMinusButtons from "../PlusMinusButtons";
import type { StatsState } from "../../../models/Stats";
import type { Action } from "@/models/reducer";

type Props = {
  stats: StatsState;
  dispatch: React.Dispatch<Action>;
};

const TATSSection: FC<Props> = ({ stats, dispatch }) => {
  const gridStats = [
    {
      key: "technical",
      label: "Technical",
      value: () => stats.fouls.technical,
      onPlus: () =>
        dispatch({
          type: "foul",
          payload: { kind: "technical", delta: 1 },
        }),
      onMinus: () =>
        dispatch({
          type: "foul",
          payload: { kind: "technical", delta: -1 },
        }),
    },
    {
      key: "assists",
      label: "Assists",
      value: () => stats.assists,
      onPlus: () =>
        dispatch({
          type: "assists",
          delta: 1,
        }),
      onMinus: () =>
        dispatch({
          type: "assists",
          delta: -1,
        }),
    },
    {
      key: "turnovers",
      label: "Turnovers",
      value: () => stats.defense.turnovers,
      onPlus: () =>
        dispatch({
          type: "defense",
          payload: { field: "turnovers", delta: 1 },
        }),
      onMinus: () =>
        dispatch({
          type: "defense",
          payload: { field: "turnovers", delta: -1 },
        }),
    },
    {
      key: "steals",
      label: "Steals",
      value: () => stats.defense.steals,
      onPlus: () =>
        dispatch({
          type: "defense",
          payload: { field: "steals", delta: 1 },
        }),
      onMinus: () =>
        dispatch({
          type: "defense",
          payload: { field: "steals", delta: -1 },
        }),
    },
  ] as const;

  return (
    <div className="w-[65%] grid grid-cols-[1.2fr_1fr] grid-rows-2 divide-x divide-y">
      {gridStats.map(({ key, label, value, onPlus, onMinus }) => (
        <div key={key} className="p-3 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <p className="text-phoenix">{label}</p>
            <p>{value()}</p>
          </div>

          <PlusMinusButtons
            onPlusClick={onPlus}
            onMinusClick={onMinus}
            minusDisable={() => value() <= 0}
          />
        </div>
      ))}
    </div>
  );
};

export default TATSSection;
