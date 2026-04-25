import type { Game } from "../models/Game";
import { getGamesByRound } from "../services/StatsService";
import { useQuery } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import type { GamesRound } from "../models/GamesRound";
import Loading from "../components/Loading";

const AllGames: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: gamesByRound, isLoading } = useQuery({
    queryKey: ["gamesByRound"],
    queryFn: getGamesByRound,
  });

  const scrollToRound = (round: string) => {
    const element = document.getElementById(round);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // useEffect(() => {
  //   scrollToRound("round3");
  // }, []);

  const navigate = useNavigate();

  const handleClick = (game: Game) => {
    const team1 = game.homeTeam.name.replace(/\s+/g, "-");
    const team2 = game.guestTeam.name.replace(/\s+/g, "-");

    navigate(`/game/${team1}/vs/${team2}`, {
      state:{
        gameId: game.id,
      }
    });
  };

  return (
    <div className="pt-16 min-h-screen w-screen font-palanquin ">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="p-5 flex items-center justify-between">
            <h1 className="text-center pl-40 text-3xl font-bold w-[90%] ">
              All <span className="text-phoenix">Games</span> by{" "}
              <span className="text-phoenix">Rounds</span>
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
                className="dropdown-content menu p-2 shadow rounded-box w-38 bg-surface-light dark:bg-surface-dark/70 "
              >
                {gamesByRound &&
                  gamesByRound.map((gr: GamesRound) => (
                    <li key={`round-${gr.round}`}>
                      <button
                        className=" text-lg font-medium w-full text-center hover:bg-surface"
                        onClick={() => {
                          scrollToRound(`round-${gr.round}`);
                          setIsOpen(true);
                          (document.activeElement as HTMLElement)?.blur();
                        }}
                      >
                        Round {gr.round}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {gamesByRound &&
            gamesByRound.map((gr: GamesRound) => (
              <div
                key={`round-${gr.round}`}
                id={`round-${gr.round}`}
                className="pt-16"
              >
                <h2 className="text-phoenix text-3xl font-bold text-center my-5">
                  Round {gr.round}
                </h2>

                <div className="flex flex-col gap-5 m-5">
                  {gr.games.map((game: Game) => (
                    <div
                      key={`round-${gr.round}`}
                      className={`flex max-sm:flex-col justify-center items-center p-10 bg-surface-light dark:bg-surface-dark/70 rounded-3xl cursor-pointer`}
                      onClick={() => handleClick(game)}
                    >
                      <div className="flex w-[40%] flex-col gap-3">
                        <img
                          src={`${game.homeTeam?.logoPathURL}`}
                          alt={`${game.homeTeam} logo`}
                          className="w-36 h-36 justify-self-start"
                        />
                        <p className="text-2xl justify-self-start text-phoenix font-extrabold">
                          {game.homeTeam.name}
                        </p>
                      </div>

                      <div className="flex w-[20%] flex-col gap-5">
                        {(game.homeTeamScore > 0 ||
                          game.guestTeamScore > 0) && (
                          <div className="flex justify-center items-center text-5xl">
                            <div
                              className={`border-2 border-black rounded-l-2xl dark:border-white border-r-0 p-5 transition-all duration-300  ${game.homeTeamScore > game.guestTeamScore ? "bg-success" : "bg-error"}`}
                            >
                              {game.homeTeamScore}
                            </div>
                            <div
                              className={`border-2 border-black rounded-r-2xl dark:border-white p-5 transition-all duration-300 ${game.guestTeamScore > game.homeTeamScore ? "bg-success" : "bg-error"}`}
                            >
                              {game.guestTeamScore}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col text-center font-semibold">
                          <p>{game.dateTime?.split("T")[0]}</p>
                          <p>{game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
                          <p>{game.venue}</p>
                        </div>
                      </div>

                      <div className="flex w-[40%] items-end flex-col gap-3 text-center">
                        <img
                          src={`${game.guestTeam?.logoPathURL}`}
                          alt="away logo"
                          className="w-36 h-36"
                        />
                        <p className="text-2xl text-phoenix font-extrabold">
                          {game.guestTeam.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default AllGames;
