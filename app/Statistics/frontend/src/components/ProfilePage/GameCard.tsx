import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import { FaArrowRight } from "react-icons/fa";
import type { Game } from "../../models/Game";

interface Props {
  game: Game;
}

const GameCard: FC<Props> = (props) => {
  const navigate = useNavigate();

  const handleClick = (game: Game) => {
    const homeTeam = props.game.homeTeam.name;
    const awayTeam = props.game.guestTeam.name;

    navigate(`/game/${homeTeam}/vs/${awayTeam}`, {
      state: { game },
    });
  };

  return (
    <div
      className="flex flex-col justify-center items-center gap-2 p-5 px-10 bg-phoenix/80 hover:bg-phoenix border-2 border-phoenix rounded-2xl shadow-inner drop-shadow text-white dark:text-black font-palanquin cursor-pointer"
      onClick={() => handleClick(props.game)}
    >
      <div className="flex justify-center items-center gap-3">
        <img
          src="https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp"
          alt={`${props.game.homeTeam.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-xl font-semibold">
          {props.game.homeTeam.name}
        </span>
      </div>

      <p>{props.game.dateTime?.split("T")[0] ?? ""}</p>
      <p>{props.game.dateTime?.split("T")[1]?.slice(0, 5) ?? ""}</p>

      <div className="flex justify-center items-center gap-3 ">
        <img
          src="https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp"
          alt={`${props.game.guestTeam.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-xl font-semibold">
          {props.game.guestTeam.name}
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
