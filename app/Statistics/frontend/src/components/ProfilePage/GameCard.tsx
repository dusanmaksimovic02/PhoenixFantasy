import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import type { Matchup } from "./YourMatches";
import { FaArrowRight } from "react-icons/fa";

type Props = {
  matchup: Matchup;
};

const GameCard: FC<Props> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const team1 = props.matchup.team1.name.replace(/\s+/g, "-");
    const team2 = props.matchup.team2.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`);
  };

  return (
    <div
      className="flex flex-col justify-center items-center gap-2 p-5 px-10 bg-phoenix/80 hover:bg-phoenix border-2 border-phoenix rounded-2xl shadow-inner drop-shadow text-white dark:text-black font-palanquin cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-3">
        <img
          src={props.matchup.team1.logo}
          alt={`${props.matchup.team1.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-xl font-semibold">
          {props.matchup.team1.name}
        </span>
      </div>

      <p>{props.matchup.date}</p>

      <div className="flex justify-center items-center gap-3 ">
        <img
          src={props.matchup.team2.logo}
          alt={`${props.matchup.team2.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-xl font-semibold">
          {props.matchup.team2.name}
        </span>
      </div>
      <div className="flex justify-center items-center gap-3">
        <p>Start Game</p>
        <FaArrowRight />
      </div>
    </div>
  );
};

export default GameCard;
