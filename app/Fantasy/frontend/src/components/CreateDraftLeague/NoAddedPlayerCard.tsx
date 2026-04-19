import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";
import { FaPlus } from "react-icons/fa";

const NoAddedPlayerCard: FC = () => {
  return (
    <div className="relative w-fit">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div
        className="absolute inset-0 w-full h-full  text-black bg-black/50 flex flex-col justify-center items-center gap-3 pt-10"
        style={{
          WebkitMaskImage: `url(${jersey})`,
          maskImage: `url(${jersey})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      >
        <FaPlus
          className="text-white hover:cursor-pointer hover:scale-120"
          size={25}
        />
        <p className="text-[13px] text-white">Player</p>
      </div>
    </div>
  );
};

export default NoAddedPlayerCard;
