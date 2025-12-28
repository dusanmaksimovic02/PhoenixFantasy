import { useEffect, useState, type FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export type Team = {
  name: string;
  logo: string;
};

export type Matchup = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  arena: string;
  played: boolean;
  score: { homeTeam: number; awayTeam: number } | null;
};

export type TournamentRounds = {
  [key: string]: Matchup[];
};

const rounds: TournamentRounds = {
  round1: [
    {
      id: "1",
      homeTeam: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-30",
      time: "18:00",
      arena: "Phoenix Arena",
      played: true,
      score: { homeTeam: 85, awayTeam: 78 },
    },
    {
      id: "2",
      homeTeam: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-30",
      time: "20:00",
      arena: "Thunder Dome",
      played: true,
      score: { homeTeam: 90, awayTeam: 87 },
    },
    {
      id: "3",
      homeTeam: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-31",
      time: "18:00",
      arena: "Phoenix Arena",
      played: true,
      score: { homeTeam: 79, awayTeam: 82 },
    },
    {
      id: "4",
      homeTeam: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2024-12-31",
      time: "20:00",
      arena: "Thunder Dome",
      played: true,
      score: { homeTeam: 88, awayTeam: 91 },
    },
  ],
  round2: [
    {
      id: "5",
      homeTeam: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-01",
      time: "18:00",
      arena: "Phoenix Arena",
      played: true,
      score: { homeTeam: 77, awayTeam: 85 },
    },
    {
      id: "6",
      homeTeam: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-01",
      time: "20:00",
      arena: "Thunder Dome",
      played: true,
      score: { homeTeam: 89, awayTeam: 83 },
    },
    {
      id: "7",
      homeTeam: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-02",
      time: "18:00",
      arena: "Phoenix Arena",
      played: true,
      score: { homeTeam: 95, awayTeam: 90 },
    },
    {
      id: "8",
      homeTeam: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-02",
      time: "20:00",
      arena: "Thunder Dome",
      played: true,
      score: { homeTeam: 80, awayTeam: 86 },
    },
  ],
  round3: [
    {
      id: "9",
      homeTeam: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-03",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "10",
      homeTeam: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-03",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
    {
      id: "11",
      homeTeam: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-04",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "12",
      homeTeam: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-04",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
  ],
  round4: [
    {
      id: "13",
      homeTeam: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-05",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "14",
      homeTeam: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-05",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
    {
      id: "15",
      homeTeam: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-06",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "16",
      homeTeam: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-06",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
  ],

  round5: [
    {
      id: "17",
      homeTeam: {
        name: "Team A",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team D",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-07",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "18",
      homeTeam: {
        name: "Team B",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-07",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
    {
      id: "19",
      homeTeam: {
        name: "Team C",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-08",
      time: "18:00",
      arena: "Phoenix Arena",
      played: false,
      score: null,
    },
    {
      id: "20",
      homeTeam: {
        name: "Team E",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://media-cdn.incrowdsports.com/2681304e-77dd-4331-88b1-683078c0fb49.png?width=90&height=90&resizeType=fill&format=webp",
      },
      date: "2025-01-08",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
  ],
};

const AllGames: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const scrollToRound = (round: string) => {
    const element = document.getElementById(round);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    scrollToRound("round3");
  }, []);

  const navigate = useNavigate();

  const handleClick = (match: Matchup) => {
    const team1 = match.homeTeam.name.replace(/\s+/g, "-");
    const team2 = match.awayTeam.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`);
  };

  return (
    <div className="pt-16 transition-all duration-1000">
      <div className="p-5 flex items-center justify-between">
        <h1 className="text-center text-3xl font-bold w-[90%] ">
          All Games by Rounds
        </h1>

        <div className="dropdown">
          <label
            onFocus={() => setIsOpen(false)}
            onBlur={() => setIsOpen(true)}
            tabIndex={0}
            className="btn bg-phoenix/80 border-phoenix hover:bg-phoenix w-fit gap-1 whitespace-nowrap text-white flex items-center"
          >
            <span className="text-lg font-medium">Go to round</span>
            <IoIosArrowDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? `rotate-0` : `rotate-180`
              }`}
            />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow rounded-box w-52 bg-surface-light dark:bg-surface-dark/70 "
          >
            {Object.keys(rounds).map((round) => (
              <li key={round}>
                <button
                  className=" text-lg font-medium w-full text-left hover:bg-surface"
                  onClick={() => {
                    scrollToRound(round);
                    setIsOpen(true);
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                >
                  {round.replace("round", "Round ")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {Object.entries(rounds).map(([roundName, matches]) => (
        <div key={roundName} id={roundName} className="pt-16">
          <h2 className="text-phoenix text-3xl font-bold text-center my-5">
            {roundName.replace("round", "Round ")}
          </h2>

          <div className="flex flex-col gap-5 m-5">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex max-sm:flex-col justify-between items-center gap-5 p-5 bg-surface-light dark:bg-surface-dark/70 rounded-3xl cursor-pointer"
                onClick={() => handleClick(match)}
              >
                <div className="flex justify-center items-center flex-col gap-3 text-center">
                  <img
                    src={match.homeTeam.logo}
                    alt={`${match.homeTeam.name} logo`}
                    className="w-36 h-36"
                  />
                  <p className="text-2xl text-phoenix font-extrabold">
                    {match.homeTeam.name}
                  </p>
                </div>
                <div className=" flex flex-col gap-5">
                  {match.played && (
                    <div className=" flex text-5xl">
                      <div
                        className={`border-2 border-r-0 p-5 ${
                          match.score!.homeTeam > match.score!.awayTeam
                            ? "bg-success"
                            : "bg-error"
                        }`}
                      >
                        {match.score?.homeTeam}
                      </div>
                      <div
                        className={`border-2 p-5 ${
                          match.score!.awayTeam > match.score!.homeTeam
                            ? "bg-success"
                            : "bg-error"
                        }`}
                      >
                        {match.score?.awayTeam}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col text-center font-semibold">
                    <p>{match.date}</p>
                    <p>{match.time}</p>
                    <p>{match.arena}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center flex-col gap-3 text-center">
                  <img
                    src={match.awayTeam.logo}
                    alt={`${match.awayTeam.name} logo`}
                    className="w-36 h-36"
                  />
                  <p className="text-2xl text-phoenix font-extrabold">
                    {match.awayTeam.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllGames;
