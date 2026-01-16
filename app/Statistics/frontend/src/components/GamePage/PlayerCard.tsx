import { useState, type FC } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import AddStats from "./AddStats/AddStats";
import ChangePlayer from "./ChangePlayer";

type Props = {
  id: number;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: number;
  time: Date;
};

const PlayerCard: FC<Props> = (props) => {
  const [isOpenStats, setIsOpenStats] = useState<boolean>(false);
  const [isOpenChange, setIsOpenChange] = useState<boolean>(false);

  return (
    <>
      <div
        className="flex items-center gap-10 bg-surface-light dark:bg-surface-dark mt-5 p-5 rounded-4xl first:mt-0 cursor-pointer"
        onClick={() => setIsOpenStats(true)}
      >
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
          <LuArrowDownUp
            className="w-10 h-10 cursor-pointer hover:text-phoenix hover:rotate-180"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenChange(true);
            }}
          />
        </div>
      </div>
      {isOpenStats && (
        <AddStats
          isOpenStats={isOpenStats}
          setIsOpenStats={setIsOpenStats}
          name={props.name}
          surname={props.surname}
          position={props.position}
          jerseyNumber={props.jerseyNumber}
          time={props.time}
        />
      )}
      {isOpenChange && (
        <ChangePlayer
          isOpenChange={isOpenChange}
          setIsOpenChange={setIsOpenChange}
          name={props.name}
          surname={props.surname}
          position={props.position}
          jerseyNumber={props.jerseyNumber}
          time={props.time}
        />
      )}
    </>
  );
};

export default PlayerCard;
