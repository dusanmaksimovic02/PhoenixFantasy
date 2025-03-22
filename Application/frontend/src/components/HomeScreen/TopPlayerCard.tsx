import { Player } from "./TopPlayer";

type Props = {
  player: Player;
};

const TopPlayerCard = (props: Props) => {
  return (
    <div className="w-[350px] shadow-inner drop-shadow p-5 bg-slate-50 flex flex-col gap-5 rounded-2xl justify-center items-center text-black bg-surface-light  text-foreground dark:bg-surface-dark">
      <div
        className={`rounded-full w-48 h-48 p-2 m-5 border-2 border-black bg-cover`}
        style={{ backgroundImage: `url(${props.player.imageUrl})` }}
      ></div>

      <div className="font-extrabold text-phoenix text-center text-[23px]">
        {props.player.fullName}
      </div>

      <div className="font-extrabold  text-center">{props.player.team}</div>

      <div className="flex gap-2">
        <h1 className="font-semibold">FPPG: </h1>
        <p>{props.player.fantasyPointsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <h1 className="font-semibold">PPG: </h1>
        <p>{props.player.pointsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <h1 className="font-semibold">APG: </h1>
        <p>{props.player.assistsPerGame}</p>
      </div>

      <div className="flex gap-2">
        <h1 className="font-semibold">RPG: </h1>
        <p>{props.player.reboundsPerGame}</p>
      </div>
    </div>
  );
};

export default TopPlayerCard;
