import { Menu, Button, Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router";

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
        logo: "https://via.placeholder.com/150?text=Team+A",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://via.placeholder.com/150?text=Team+H",
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
        logo: "https://via.placeholder.com/150?text=Team+B",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://via.placeholder.com/150?text=Team+G",
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
        logo: "https://via.placeholder.com/150?text=Team+C",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://via.placeholder.com/150?text=Team+F",
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
        logo: "https://via.placeholder.com/150?text=Team+D",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://via.placeholder.com/150?text=Team+E",
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
        logo: "https://via.placeholder.com/150?text=Team+A",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://via.placeholder.com/150?text=Team+G",
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
        logo: "https://via.placeholder.com/150?text=Team+B",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://via.placeholder.com/150?text=Team+E",
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
        logo: "https://via.placeholder.com/150?text=Team+C",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://via.placeholder.com/150?text=Team+H",
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
        logo: "https://via.placeholder.com/150?text=Team+D",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://via.placeholder.com/150?text=Team+F",
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
        logo: "https://via.placeholder.com/150?text=Team+A",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://via.placeholder.com/150?text=Team+F",
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
        logo: "https://via.placeholder.com/150?text=Team+B",
      },
      awayTeam: {
        name: "Team D",
        logo: "https://via.placeholder.com/150?text=Team+D",
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
        logo: "https://via.placeholder.com/150?text=Team+C",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://via.placeholder.com/150?text=Team+H",
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
        logo: "https://via.placeholder.com/150?text=Team+E",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://via.placeholder.com/150?text=Team+G",
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
        logo: "https://via.placeholder.com/150?text=Team+A",
      },
      awayTeam: {
        name: "Team E",
        logo: "https://via.placeholder.com/150?text=Team+E",
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
        logo: "https://via.placeholder.com/150?text=Team+B",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://via.placeholder.com/150?text=Team+G",
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
        logo: "https://via.placeholder.com/150?text=Team+C",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://via.placeholder.com/150?text=Team+F",
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
        logo: "https://via.placeholder.com/150?text=Team+D",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://via.placeholder.com/150?text=Team+H",
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
        logo: "https://via.placeholder.com/150?text=Team+A",
      },
      awayTeam: {
        name: "Team D",
        logo: "https://via.placeholder.com/150?text=Team+D",
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
        logo: "https://via.placeholder.com/150?text=Team+B",
      },
      awayTeam: {
        name: "Team H",
        logo: "https://via.placeholder.com/150?text=Team+H",
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
        logo: "https://via.placeholder.com/150?text=Team+C",
      },
      awayTeam: {
        name: "Team G",
        logo: "https://via.placeholder.com/150?text=Team+G",
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
        logo: "https://via.placeholder.com/150?text=Team+E",
      },
      awayTeam: {
        name: "Team F",
        logo: "https://via.placeholder.com/150?text=Team+F",
      },
      date: "2025-01-08",
      time: "20:00",
      arena: "Thunder Dome",
      played: false,
      score: null,
    },
  ],
};

const AllGames = () => {
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
    <div className="pt-[4rem]">
      <div className="p-5 flex">
        <Typography type="h1" className="text-center w-[90%]">
          All Games by Rounds
        </Typography>
        <div className="flex justify-center items-center">
          <Menu>
            <Menu.Trigger
              as={Button}
              size="2xl"
              variant="ghost"
              className="text-white flex items-center gap-1"
            >
              <Typography type="h6">Go to round</Typography>
              <IoIosArrowDown className="h-3.5 w-3.5 stroke-2 group-data-[open=true]:rotate-180" />
            </Menu.Trigger>
            <Menu.Content className="bg-gray-900">
              {Object.keys(rounds).map((round) => (
                <Menu.Item key={round} onClick={() => scrollToRound(round)}>
                  <Typography className="text-lg font-medium text-white">
                    {round.replace("round", "Round ")}
                  </Typography>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu>
        </div>
      </div>
      {Object.entries(rounds).map(([roundName, matches]) => (
        <div key={roundName} id={roundName} className="pt-[4rem]">
          <h2 className="text-phoenix text-3xl font-bold text-center my-5">
            {roundName.replace("round", "Round ")}
          </h2>

          <div className="flex flex-col gap-5 m-5">
            {matches.map((match, index) => (
              <div
                key={index}
                className="flex max-sm:flex-col justify-between items-center gap-5 p-5 bg-surface-light dark:bg-surface-dark  dark:bg-opacity-70 rounded-3xl cursor-pointer"
                onClick={() => handleClick(match)}
              >
                <div className="flex justify-center items-center flex-col gap-3 text-center">
                  <img
                    src={match.homeTeam.logo}
                    alt="home logo"
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
                    alt="home logo"
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
