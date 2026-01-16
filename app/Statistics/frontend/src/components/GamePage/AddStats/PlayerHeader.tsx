import type { FC } from "react";

type Props = {
  setIsOpenStats: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: number;
  time: Date;
};

const PlayerHeader: FC<Props> = ({
  setIsOpenStats,
  name,
  surname,
  position,
  jerseyNumber,
  time,
}) => {
  return (
    <div
      className="w-full flex items-center gap-10 p-5 py-1"
      onClick={() => setIsOpenStats(true)}
    >
      <div className="bg-jersey bg-contain bg-no-repeat h-20 w-25 flex justify-center items-center">
        <p className="text-black pt-4 pr-1 font-bold text-xl">
          {jerseyNumber.toString()}
        </p>
      </div>
      <div className="flex w-full justify-between items-center">
        <div>
          <p className="text-phoenix">
            {name} {surname}
          </p>
          <p>{position}</p>
        </div>
        <div className="">
          <p>Time played</p>
          <p>{time.toLocaleTimeString()}</p>
        </div>
      </div>
      <button className="btn bg-phoenix/80 hover:bg-phoenix hover:border-phoenix border-phoenix hover:border-4 hover:cursor-pointer shadow-inner drop-shadow w-25 h-12 rounded-xl text-2xl">
        Save
      </button>
    </div>
  );
};

export default PlayerHeader;
