import type { FC } from "react";
// import jersey from "../../assets/images/jersey.png";
import { LuArrowDownUp } from "react-icons/lu";

type Props = {
  id: number;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: number;
  time: Date;
};

const PlayerCard: FC<Props> = (props) => {
  console.log(props);
  return (
    <div className="flex items-center gap-10 bg-surface-light dark:bg-surface-dark mt-5 p-5 rounded-4xl first:mt-0">
      <div className="bg-jersey bg-contain bg-no-repeat h-20 w-15 flex justify-center items-center">
        <p className="text-black pt-4 pr-1 font-bold text-xl">
          {props.jerseyNumber.toString()}
        </p>
      </div>
      <div className="flex w-full justify-between items-center">
        <div>
          <p className="text-phoenix">
            {props.name} {props.surname}
          </p>
          <p>{props.position}</p>
        </div>
        <div className="">
          <p>Time played</p>
          <p>{props.time.toLocaleTimeString()}</p>
        </div>
        <LuArrowDownUp className="w-10 h-10 cursor-pointer" />
      </div>
    </div>
  );
};

export default PlayerCard;
