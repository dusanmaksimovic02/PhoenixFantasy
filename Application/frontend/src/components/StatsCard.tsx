type Props = {
  label: string;
  points: number;
  made?: number;
  miss?: number;
  percentage?: boolean;
};

const StatsCard = (props: Props) => {
  return (
    <div className="w-fit h-fit rounded-2xl bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-70 flex flex-col p-7 justify-center items-center gap-5 font-palanquin flex-grow flex-shrink max-sm:bg-surface-light dark:max-sm:bg-surface-dark dark:max-sm:text-white max-sm:text-black ">
      <p className="text-2xl text-phoenix font-bold">{props.label}</p>
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
