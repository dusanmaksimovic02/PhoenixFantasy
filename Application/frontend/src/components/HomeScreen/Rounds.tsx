import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import GameCard from "./GameCard";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router";

export type Team = {
  name: string;
  logo: string;
};

export type Matchup = {
  team1: Team;
  team2: Team;
  date: string;
};

export type TournamentRounds = {
  [key: string]: Matchup[];
};

const Rounds = () => {
  const rounds: TournamentRounds = {
    round1: [
      {
        team1: {
          name: "Team A",
          logo: "https://via.placeholder.com/150?text=Team+A",
        },
        team2: {
          name: "Team H",
          logo: "https://via.placeholder.com/150?text=Team+H",
        },
        date: "2024-12-30 18:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://via.placeholder.com/150?text=Team+B",
        },
        team2: {
          name: "Team G",
          logo: "https://via.placeholder.com/150?text=Team+G",
        },
        date: "2024-12-30 20:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://via.placeholder.com/150?text=Team+C",
        },
        team2: {
          name: "Team F",
          logo: "https://via.placeholder.com/150?text=Team+F",
        },
        date: "2024-12-31 18:00",
      },
      {
        team1: {
          name: "Team D",
          logo: "https://via.placeholder.com/150?text=Team+D",
        },
        team2: {
          name: "Team E",
          logo: "https://via.placeholder.com/150?text=Team+E",
        },
        date: "2024-12-31 20:00",
      },
    ],
    round2: [
      {
        team1: {
          name: "Team A",
          logo: "https://via.placeholder.com/150?text=Team+A",
        },
        team2: {
          name: "Team G",
          logo: "https://via.placeholder.com/150?text=Team+G",
        },
        date: "2024-12-31 18:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://via.placeholder.com/150?text=Team+H",
        },
        team2: {
          name: "Team F",
          logo: "https://via.placeholder.com/150?text=Team+F",
        },
        date: "2024-12-31 20:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://via.placeholder.com/150?text=Team+B",
        },
        team2: {
          name: "Team E",
          logo: "https://via.placeholder.com/150?text=Team+E",
        },
        date: "2025-01-01 18:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://via.placeholder.com/150?text=Team+C",
        },
        team2: {
          name: "Team D",
          logo: "https://via.placeholder.com/150?text=Team+D",
        },
        date: "2025-01-01 20:00",
      },
    ],
    round3: [
      {
        team1: {
          name: "Team A",
          logo: "https://via.placeholder.com/150?text=Team+A",
        },
        team2: {
          name: "Team F",
          logo: "https://via.placeholder.com/150?text=Team+F",
        },
        date: "2025-01-02 18:00",
      },
      {
        team1: {
          name: "Team G",
          logo: "https://via.placeholder.com/150?text=Team+G",
        },
        team2: {
          name: "Team D",
          logo: "https://via.placeholder.com/150?text=Team+D",
        },
        date: "2025-01-02 20:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://via.placeholder.com/150?text=Team+H",
        },
        team2: {
          name: "Team C",
          logo: "https://via.placeholder.com/150?text=Team+C",
        },
        date: "2025-01-03 18:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://via.placeholder.com/150?text=Team+B",
        },
        team2: {
          name: "Team E",
          logo: "https://via.placeholder.com/150?text=Team+E",
        },
        date: "2025-01-03 20:00",
      },
    ],
    round4: [
      {
        team1: {
          name: "Team A",
          logo: "https://via.placeholder.com/150?text=Team+A",
        },
        team2: {
          name: "Team E",
          logo: "https://via.placeholder.com/150?text=Team+E",
        },
        date: "2025-01-04 18:00",
      },
      {
        team1: {
          name: "Team F",
          logo: "https://via.placeholder.com/150?text=Team+F",
        },
        team2: {
          name: "Team C",
          logo: "https://via.placeholder.com/150?text=Team+C",
        },
        date: "2025-01-04 20:00",
      },
      {
        team1: {
          name: "Team G",
          logo: "https://via.placeholder.com/150?text=Team+G",
        },
        team2: {
          name: "Team B",
          logo: "https://via.placeholder.com/150?text=Team+B",
        },
        date: "2025-01-05 18:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://via.placeholder.com/150?text=Team+H",
        },
        team2: {
          name: "Team D",
          logo: "https://via.placeholder.com/150?text=Team+D",
        },
        date: "2025-01-05 20:00",
      },
    ],
    round5: [
      {
        team1: {
          name: "Team A",
          logo: "https://via.placeholder.com/150?text=Team+A",
        },
        team2: {
          name: "Team D",
          logo: "https://via.placeholder.com/150?text=Team+D",
        },
        date: "2025-01-06 18:00",
      },
      {
        team1: {
          name: "Team E",
          logo: "https://via.placeholder.com/150?text=Team+E",
        },
        team2: {
          name: "Team B",
          logo: "https://via.placeholder.com/150?text=Team+B",
        },
        date: "2025-01-06 20:00",
      },
      {
        team1: {
          name: "Team F",
          logo: "https://via.placeholder.com/150?text=Team+F",
        },
        team2: {
          name: "Team G",
          logo: "https://via.placeholder.com/150?text=Team+G",
        },
        date: "2025-01-07 18:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://via.placeholder.com/150?text=Team+C",
        },
        team2: {
          name: "Team H",
          logo: "https://via.placeholder.com/150?text=Team+H",
        },
        date: "2025-01-07 20:00",
      },
    ],
  };

  const [round, setRound] = useState<number>(1);

  return (
    <div className="font-palanquin">
      <div className="flex gap-5 justify-center text-2xl">
        <button
          onClick={() => {
            if (round - 1 > 0) setRound(round - 1);
          }}
        >
          <FaAngleLeft />
        </button>
        <h1 className="text-phoenix font-extrabold font-palanquin">
          Round {round}
        </h1>
        <button
          onClick={() => {
            if (round + 1 <= 5) setRound(round + 1);
          }}
        >
          <FaAngleRight />
        </button>
      </div>

      <div className="flex gap-5 justify-around p-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-gray-400 active:scrollbar-thumb-gray-300">
        {rounds[`round${round}`].map((game, index) => (
          <GameCard key={index} matchup={game}></GameCard>
        ))}
      </div>
      <Link className="flex justify-center p-5" to="/all-games">
        <Button className="bg-phoenix border-phoenix hover:bg-opacity-80 hover:bg-phoenix hover:border-phoenix">See all games</Button>
      </Link>
    </div>
  );
};

export default Rounds;
