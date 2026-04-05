import type { FC } from "react";

type Props = {
  setIsOpenStats: (isOpen: boolean) => void;
  name: string;
  surname: string;
  position: string;
  jerseyNumber: string;
  time: Date;
};

const PlayerHeader: FC<Props> = ({
  setIsOpenStats,
  name,
  surname,
  position,
  jerseyNumber,
}) => {
  return (
    <div
      className="w-full flex items-center gap-10 p-5 py-1"
      onClick={() => setIsOpenStats(true)}
    >
      <div className="bg-jersey bg-contain bg-no-repeat h-20 w-20 flex justify-center items-center">
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
      </div>
    </div>
  );
};

export default PlayerHeader;
