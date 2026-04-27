import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";
import logo from "../../assets/images/phoenixLogo2.png";

interface DraftLeaguePlayerCardProps {
  position: string;
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fantasyPoints: string;
  isCaptain: boolean;
  onCaptainToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isStarter: boolean;
}

const DraftLeaguePlayerCard: FC<DraftLeaguePlayerCardProps> = ({
  position,
  jerseyNumber,
  firstName,
  lastName,
  fantasyPoints,
  isCaptain,
  isStarter,
  onCaptainToggle,
}) => {
  return (
    <div className="relative w-20 h-30">
      <img src={jersey} alt="jersey" className="w-20 h-30" />

      {isStarter && (
        <button
          onClick={onCaptainToggle}
          className={`
          absolute top-1 right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold
          flex items-center justify-center cursor-pointer transition-all z-1
          ${
            isCaptain
              ? "bg-red-500 shadow-lg shadow-red-500/50 scale-110"
              : "bg-gray-400/60 hover:bg-red-400"
          }
        `}
          title={!isCaptain ? "Set as captain" : ""}
        >
          C
        </button>
      )}

      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black p-4 pt-7">
        <div className="flex items-center gap-4">
          <p className="text-[10px] pl-1.5 pt-1">{position}</p>
          <img src={logo} alt="club logo" className="w-3 h-5" />
        </div>
        <p className="text-[15.5px] text-center font-extrabold">
          {jerseyNumber}
        </p>
        <p className="text-[13px] text-center">
          {firstName.charAt(0)}. {lastName}
        </p>
        <p className="text-[13px] text-center font-bold text-nowrap max-md:text-[8px]">
          {fantasyPoints} 
        </p>
      </div>
    </div>
  );
};

export default DraftLeaguePlayerCard;
