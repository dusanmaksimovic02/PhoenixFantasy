import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";

const NoAddedPlayerCard: FC = () => {
  return (
    <div className="relative w-fit">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black p-4 pt-7 ">
        <p className="text-[13px] pt-15 pl-1 text-nowrap">Player</p>
      </div>
    </div>
  );
};

export default NoAddedPlayerCard;
