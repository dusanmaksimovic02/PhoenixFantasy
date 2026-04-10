import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";

const NoCoachAddedCard: FC = () => {
  return (
    <div className="relative w-fit px-5">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black pt-7 ">
        <p className="text-[13px] pl-8 pt-15 text-nowrap">H. Coach</p>
      </div>
    </div>
  );
};

export default NoCoachAddedCard;
