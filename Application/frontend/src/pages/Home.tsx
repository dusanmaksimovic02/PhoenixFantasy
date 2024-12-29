import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import GameCard from "../components/GameCard";

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

const Home = () => {
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
    <>
      <div className="w-full h-[100vh] pt-[3.5rem] relative bg-cover max-sm:bg-center bg-no-repeat bg-background grid sm:grid-cols-3 max-sm:grid-cols-1  grid-rows-[1fr_1fr_1fr_1fr_0.3fr] max-sm:grid-rows-[3fr_1fr_0.5fr] p-2 max-sm:h-svh max-sm:w-svw">
        <p className="text-phoenix col-start-1 ml-16 self-center row-start-1 col-span-2 row-span-2 text-[25px] font-extrabold p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-[400px] max-sm:w-fit h-fit font-palanquin max-sm:hidden text-center animate-slideInRight">
          Step into the ultimate basketball experience in the best league
        </p>
        <p className="text-phoenix sm:col-start-3 sm:row-start-2 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin justify-self-center self-center max-sm:hidden animate-slideInLeft">
          Create your draft league
        </p>
        <p className="text-phoenix sm:col-start-1 sm:row-start-3 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin justify-self-center self-center max-sm:hidden animate-slideInRight">
          Dominate the court with friends
        </p>
        <p className="text-phoenix sm:col-start-3 sm:row-start-4 p-3 bg-black bg-opacity-50 rounded-2xl border-2 w-fit h-fit font-palanquin justify-self-center self-center max-sm:hidden animate-slideInLeft">
          Make your dream team
        </p>
        <p className="text-phoenix sm:col-start-1 sm:row-start-5 sm:col-span-3 justify-self-center font-extrabold sm:text-[30px] bg-black bg-opacity-30 p-3 font-palanquin cursor-pointer self-center max-sm:w-9/12 max-sm:row-start-5 sm:animate-slideInTop max-sm:animate-slideInRotate">
          Phoenix
          <span className="text-white"> Fantasy - The </span>Home
          <span className="text-white"> of Draft</span> Basketball
          <span className="text-white">. Click here to </span>get started!
        </p>
        <div className="sm:hidden row-start-2 justify-self-center self-center text-center p-5 text-[18px] bg-black bg-opacity-50 m-4 rounded-2xl border-2 text-white animate-fadeIn">
          <p className="text-[21px] font-extrabold text-phoenix">
            Step into the ultimate basketball experience in the best league.
          </p>
          <p>Create your draft league.</p>
          <p>Dominate the court with friends.</p>
          <p>Make your dream team.</p>
        </div>
        <div className="bg-ball  bg-no-repeat sm:w-[200px] sm:h-[300px] sm:row-start-2 sm:row-span-3 sm:col-start-2 justify-self-center self-center max-sm:row-start-1 max-sm:bg-[0px_60px] max-sm:w-[150px] max-sm:h-[250px] max-sm:bg-contain animate-growIn"></div>
      </div>
      <div>
        <div className="flex gap-5 justify-center text-2xl">
          <button
            onClick={() => {
              if (round - 1 > 0) setRound(round - 1);
            }}
          >
            <FaAngleLeft />
          </button>
          <h1 className="text-phoenix font-extrabold font-palanquin">Round {round}</h1>
          <button
            onClick={() => {
              if (round + 1 <= 5) setRound(round + 1);
            }}
          >
            <FaAngleRight />
          </button>
        </div>

        <div className="flex gap-5 justify-around p-5 overflow-x-auto">
          {rounds[`round${round}`].map((game, index) => (
            <GameCard key={index} matchup={game}></GameCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
