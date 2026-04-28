import type { FC } from "react";

type Props = {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    avgPir: number;
    avgPoints: number;
    avgAssists: number;
    avgRebounds: number;
  };
};

const TopPlayerCard: FC<Props> = (props) => {
  return (
    <div className="w-87.5 snap-start shadow-inner drop-shadow p-5 flex flex-col gap-5 rounded-2xl justify-center items-center bg-surface-light  text-foreground dark:bg-surface-dark ">
      <div className={` w-48 h-48 m-5 `}>
        <img src={`/images/players/${props.player.id}.webp`} alt="" />
      </div>

      <div className="font-extrabold text-phoenix text-center text-[23px]">
        {props.player.firstName} {props.player.lastName}
      </div>

      <div className="font-extrabold  text-center">{props.player.position}</div>

      <div className="flex gap-2">
        <p className="font-semibold">FPPG: </p>
        <p>{props.player.avgPir}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">PPG: </p>
        <p>{props.player.avgPoints}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">APG: </p>
        <p>{props.player.avgAssists}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">RPG: </p>
        <p>{props.player.avgRebounds}</p>
      </div>
    </div>
  );
};

export default TopPlayerCard;
