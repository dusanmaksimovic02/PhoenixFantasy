import { type FC } from "react";
import coach from "../../assets/images/coach.png";
import { FaPlus } from "react-icons/fa";
import { useDraft } from "../../context/draft/useDraft";

const NoCoachAddedCard: FC = () => {
  const { isMyTurn } = useDraft();
  return (
    <div className="relative w-fit px-5">
      <img src={coach} alt="coach image" className="w-20 h-25 rounded-2xl" />
      <div
        className="absolute inset-0 w-full h-full text-black bg-black/50 flex flex-col justify-center items-center gap-3 pt-10"
        style={{
          WebkitMaskImage: `url(${coach})`,
          maskImage: `url(${coach})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <FaPlus
          className={`text-white ${isMyTurn() ? "hover:cursor-pointer hover:scale-120" : "pointer-events-none hover:cursor-auto"}`}
          size={25}
          onClick={() => console.log("")}
        />
        <p className="text-[13px] text-white">H. Coach</p>
      </div>
    </div>
  );
};

export default NoCoachAddedCard;
