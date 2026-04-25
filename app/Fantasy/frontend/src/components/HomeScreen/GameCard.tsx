import { useNavigate } from "react-router-dom";
import type { Game } from "../../models/Game";
import type { FC } from "react";

type Props = {
  game: Game;
};

const GameCard: FC<Props> = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const team1 = props.game.homeTeam.name.replace(/\s+/g, "-");
    const team2 = props.game.guestTeam.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`, {
      state: {
        gameId: props.game.id,
      },
    });
  };

  return (
    <div
      className="flex flex-col justify-center items-center gap-2 px-12 p-5 bg-phoenix rounded-2xl shadow-inner drop-shadow text-white dark:text-black font-palanquin cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-3 max-lg:w-37.5">
        <img
          src={`${props.game.homeTeam.logoPathURL}`}
          alt={`${props.game.homeTeam.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-2xl font-semibold max-lg:text-[17px]">
          {props.game.homeTeam.name}
        </span>
      </div>

      <p>
        {new Date(props.game.dateTime).toLocaleString("sr-RS", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="flex justify-center items-center gap-3 max-lg:w-37.5">
        <img
          src={`${props.game.guestTeam.logoPathURL}`}
          alt={`${props.game.guestTeam.name} logo`}
          className="w-10 rounded-full"
        />
        <span className="text-2xl font-semibold max-lg:text-[17px]">
          {props.game.guestTeam.name}
        </span>
      </div>
    </div>
  );
};

export default GameCard;
