import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";

const AddedPlayerToTeamCard: FC = () => {
  return (
    <div className="relative w-20 h-30 ">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black p-4 pt-7 ">
        <div className="flex  items-center gap-2 ">
          <p className="text-[10px] pl-1.5 pt-1">PG</p>
          <img
            src="https://upload.wikimedia.org/wikipedia/sr/thumb/8/80/KK_Partizan_logo.svg/1920px-KK_Partizan_logo.svg.png"
            alt="club logo"
            className="w-4 h-4 pr-1 "
          />
        </div>
        <p className="text-[15.5px] text-center font-extrabold">55</p>
        <p className="text-[13px] text-center text-nowrap">C. Jones</p>
        <p className="text-[13px] text-center font-bold text-nowrap max-md:text-[8px]">
          14.67 p
        </p>
      </div>
    </div>
  );
};

export default AddedPlayerToTeamCard;
