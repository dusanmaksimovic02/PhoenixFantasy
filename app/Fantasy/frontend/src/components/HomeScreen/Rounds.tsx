import { useState, type FC } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import GameCard from "./GameCard";
import { Link } from "react-router-dom";

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

const Rounds: FC = () => {
  const rounds: TournamentRounds = {
    round1: [
      {
        team1: {
          name: "Team A",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team H",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-30 18:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team G",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-30 20:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team F",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-31 18:00",
      },
      {
        team1: {
          name: "Team D",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team E",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-31 20:00",
      },
    ],
    round2: [
      {
        team1: {
          name: "Team A",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team G",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-31 18:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team F",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2024-12-31 20:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team E",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-01 18:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team D",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-01 20:00",
      },
    ],
    round3: [
      {
        team1: {
          name: "Team A",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team F",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-02 18:00",
      },
      {
        team1: {
          name: "Team G",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team D",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-02 20:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team C",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-03 18:00",
      },
      {
        team1: {
          name: "Team B",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team E",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-03 20:00",
      },
    ],
    round4: [
      {
        team1: {
          name: "Team A",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team E",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-04 18:00",
      },
      {
        team1: {
          name: "Team F",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team C",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-04 20:00",
      },
      {
        team1: {
          name: "Team G",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team B",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-05 18:00",
      },
      {
        team1: {
          name: "Team H",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team D",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-05 20:00",
      },
    ],
    round5: [
      {
        team1: {
          name: "Team A",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team D",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-06 18:00",
      },
      {
        team1: {
          name: "Team E",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team B",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-06 20:00",
      },
      {
        team1: {
          name: "Team F",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team G",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-07 18:00",
      },
      {
        team1: {
          name: "Team C",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        team2: {
          name: "Team H",
          logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
        },
        date: "2025-01-07 20:00",
      },
    ],
  };

  const [round, setRound] = useState<number>(1);
  const maxRounds = Object.keys(rounds).length;

  return (
    <div className="font-palanquin">
      <div className="flex gap-5 justify-center text-2xl p-5">
        <button
          onClick={() => {
            setRound((prev) => Math.max(prev - 1, 1));
          }}
          className="cursor-pointer"
        >
          <FaAngleLeft />
        </button>
        <h1 className="text-phoenix font-extrabold font-palanquin">
          Round {round}
        </h1>
        <button
          className="cursor-pointer"
          onClick={() => {
            setRound((prev) => Math.min(prev + 1, maxRounds));
          }}
        >
          <FaAngleRight />
        </button>
      </div>

      <div className="flex gap-5 justify-around p-5 py-8 overflow-x-auto ">
        {rounds[`round${round}`].map((game, index) => (
          <GameCard key={index} matchup={game}></GameCard>
        ))}
      </div>
      <Link className="flex justify-center " to="/all-games">
        <button className="btn bg-phoenix/80 hover:bg-phoenix  border-phoenix whitespace-nowrap hover:border-4 hover:cursor-pointer w-35 shadow-inner drop-shadow h-12 rounded-2xl text-2xl mt-5 ml-10 text-white dark:text-black text-[16px]">
          See all games
        </button>
      </Link>
    </div>
  );
};

export default Rounds;
