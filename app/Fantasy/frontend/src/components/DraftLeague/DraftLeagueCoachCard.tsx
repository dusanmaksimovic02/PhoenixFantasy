import { type FC } from "react";
import coach from "../../assets/images/coach.png";
import logo from "../../assets/images/phoenixLogo2.png";

interface DraftLeagueCoachCardProps {
  firstName: string;
  lastName: string;
  fantasyPoints: string;
}

const DraftLeagueCoachCard: FC<DraftLeagueCoachCardProps> = ({
  firstName,
  lastName,
  fantasyPoints,
}) => {
  return (
    <div className="relative w-fit">
      <img src={coach} alt="coach" className="w-20 h-25 rounded-2xl" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black pt-3">
        <div className="flex items-center justify-between pt-5">
          <p className="text-[10px] pl-2">HC</p>
          <img src={logo} alt="club logo" className="w-3 h-5 mr-2" />
        </div>
        <p className="text-[13px] text-center font-bold pt-2">
          {fantasyPoints} p
        </p>
        <p className="text-[13px] text-center text-nowrap">
          {firstName[0]}. {lastName}
        </p>
      </div>
    </div>
  );
};

export default DraftLeagueCoachCard;
