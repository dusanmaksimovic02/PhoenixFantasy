import { type FC } from "react";
import jersey from "../../assets/images/jersey.png";
import logo from "../../assets/images/phoenixLogo2.png";

interface AddedPlayerToTeamCardProps {
  position: string;
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fantasyPoints: string;
}

const AddedPlayerToTeamCard: FC<AddedPlayerToTeamCardProps> = (props) => {
  return (
    <div className="relative w-20 h-30">
      <img src={jersey} alt="jersey image" className="w-20 h-30" />
      <div className="absolute flex flex-col w-full h-full top-0 left-0 text-black p-4 pt-7 ">
        <div className="flex  items-center gap-2 ">
          <p className="text-[10px] pl-1.5 pt-1">{props.position}</p>
          <img src={logo} alt="club logo" className="w-3 h-5" />
        </div>
        <p className="text-[15.5px] text-center font-extrabold">
          {props.jerseyNumber}
        </p>
        <p className="text-[13px] text-center">
          {props.firstName.charAt(0)}. {props.lastName}
        </p>
        <p className="text-[13px] text-center font-bold text-nowrap max-md:text-[8px]">
          {props.fantasyPoints}
        </p>
      </div>
    </div>
  );
};

export default AddedPlayerToTeamCard;
