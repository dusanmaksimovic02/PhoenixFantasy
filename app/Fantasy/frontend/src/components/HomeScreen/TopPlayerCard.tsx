import type { FC } from "react";
import { type Player } from "./TopPlayer";

type Props = {
  player: Player;
};

const TopPlayerCard: FC<Props> = (props) => {
  return (
    <div className="w-87.5 snap-start shadow-inner drop-shadow p-5 flex flex-col gap-5 rounded-2xl justify-center items-center bg-surface-light  text-foreground dark:bg-surface-dark ">
      <div
        className={`rounded-full w-48 h-48 p-2 m-5 border-2 border-black bg-cover`}
        style={{ backgroundImage: `url(${props.player.imageUrl})` }}
      ></div>

      <div className="font-extrabold text-phoenix text-center text-[23px]">
        {props.player.fullName}
      </div>

      <div className="font-extrabold  text-center">{props.player.team}</div>

      <div className="flex gap-2">
        <p className="font-semibold">FPPG: </p>
        <p>{props.player.fantasyPointsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">PPG: </p>
        <p>{props.player.pointsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">APG: </p>
        <p>{props.player.assistsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-semibold">RPG: </p>
        <p>{props.player.reboundsPerGame}</p>
      </div>
    </div>
  );
};

export default TopPlayerCard;
