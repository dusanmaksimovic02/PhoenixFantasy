import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";

const AddedCoachCard: FC = () => {
  return (
    <div className="relative w-fit px-5">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black pt-7 ">
        <div className="flex pl-8.5  items-center gap-1.5 ">
          <p className="text-[10px] pl-2 pt-1">HC</p>
          <img
            src="https://upload.wikimedia.org/wikipedia/sr/thumb/8/80/KK_Partizan_logo.svg/1920px-KK_Partizan_logo.svg.png"
            alt="club logo"
            className="w-4 h-4 pr-1 "
          />
        </div>
        <p className="text-[13px] text-center font-bold pt-5">10</p>
        <p className="text-[13px] left pl-5 text-nowrap">Z. Obradovic</p>
      </div>
    </div>
  );
};

export default AddedCoachCard;
