import type { FC } from "react";

type Props = {
  label: string;
  points: number;
  made?: number;
  miss?: number;
  percentage?: boolean;
};

const StatsCard: FC<Props> = (props) => {
  return (
    <div className="w-fit h-fit rounded-2xl bg-surface-light dark:bg-surface-dark flex flex-col p-5 justify-center items-center font-palanquin grow shrink">
      <p className="text-xl text-black dark:text-white font-bold">{props.label}</p>
      <p className="text-4xl font-bold">
        {props.percentage ? props.points + " %" : props.points}
      </p>
      {props.made != undefined && props.miss != undefined && (
        <p className="text-2xl">
          {props.made} / {props.miss + props.made}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
