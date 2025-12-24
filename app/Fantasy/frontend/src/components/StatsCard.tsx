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
    <div className="w-fit h-fit rounded-2xl  bg-phoenix flex flex-col p-7 justify-center items-center text-white dark:text-black gap-5 font-palanquin grow shrink  ">
      <p className="text-2xl text-black dark:text-white font-bold">{props.label}</p>
      <p className="text-5xl font-extrabold">
        {props.percentage ? props.points + " %" : props.points}
      </p>
      {props.made != undefined && props.miss != undefined && (
        <p className="text-4xl">
          {props.made} / {props.miss + props.made}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
