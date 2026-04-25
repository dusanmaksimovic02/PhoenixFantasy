import { useState, type FC } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import GameCard from "./GameCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGamesByRound } from "../../services/StatsService";

const Rounds: FC = () => {
  const { data: gamesByRound } = useQuery({
    queryKey: ["gamesByRound"],
    queryFn: getGamesByRound,
  });

  const [round, setRound] = useState<number>(1);
  const maxRounds = Object.keys(gamesByRound || {}).length;

  return (
    <div className="font-palanquin max-sm:pt-16">
      <div className="flex gap-5 justify-center text-2xl p-5">
        <button
          disabled={round == 1}
          onClick={() => {
            setRound((prev) => Math.max(prev - 1, 1));
          }}
          className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FaAngleLeft />
        </button>
        <h1 className="text-phoenix font-extrabold font-palanquin">
          Round {round}
        </h1>
        <button
          disabled={round == maxRounds}
          className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => {
            setRound((prev) => Math.min(prev + 1, maxRounds));
          }}
        >
          <FaAngleRight />
        </button>
      </div>

      <div className="flex gap-5 justify-around p-5 py-8 overflow-x-auto ">
        {gamesByRound &&
          gamesByRound
            .find((g) => g.round == round)
            ?.games.map((game, index) => (
              <GameCard key={index} game={game}></GameCard>
            ))}
      </div>
      <Link className="flex justify-center " to="/all-games">
        <button className="btn bg-phoenix/80 hover:bg-phoenix  border-phoenix whitespace-nowrap hover:border-4 hover:cursor-pointer w-50 shadow-inner drop-shadow h-15 rounded-2xl text-2xl mt-5 ml-10 text-white dark:text-black ">
          See all games
        </button>
      </Link>
    </div>
  );
};

export default Rounds;
