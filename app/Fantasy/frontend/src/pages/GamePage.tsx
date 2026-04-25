import { useLocation, useNavigate } from "react-router-dom";
import GameInfo from "../components/GamePage/GameInfo";
import PlayersStats from "../components/GamePage/PlayersStats";
import TeamStats from "../components/GamePage/TeamStats";
import { useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGameById } from "../services/StatsService";
import Loading from "../components/Loading";

const GamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const gameId = location.state.gameId;

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameById(gameId),
  });

  const hash = location.hash;

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
  };

  useEffect(() => {
    const allowed = [
      "",
      "#stats-leaders",
      "#team-stats",
      "#home-players",
      "#away-players",
    ];

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true, state: location.state });
    }
  }, [hash, navigate]);

  return (
    <>
      <div className="pt-14 h-fit w-screen min-h-screen">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {game && (
              <>
                <div className=" h-fit w-full  max-sm:h-svh">
                  <div className="h-fit flex max-sm:flex-col justify-between items-center gap-5 bg-phoenix/95 p-5 text-white dark:text-black max-sm:h-svh max-sm:justify-around">
                    <div className="w-full flex max-sm:flex-col justify-between items-center gap-5 p-5  rounded-3xl ">
                      <div className="flex justify-center items-center flex-col gap-3 text-center">
                        <img
                          src={`${game && game.homeTeam.logoPathURL}`}
                          alt={`${game && game.homeTeam} logo`}
                          className="w-36 h-36"
                        />
                        <p className="text-2xl font-extrabold">
                          {game && game.homeTeam.name}
                        </p>
                      </div>
                      <div className="flex w-[20%] flex-col gap-5">
                        {((game && game.homeTeamScore > 0) ||
                          (game && game.guestTeamScore > 0)) && (
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
                          <p>Data: {game && game.dateTime?.split("T")[0]}</p>
                          <p>
                            Time:{" "}
                            {game && game.dateTime?.split("T")[1]?.slice(0, 5)}
                          </p>
                          <p>Venue: {game && game.venue}</p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center flex-col gap-3 text-center">
                        <img
                          src={game && game.guestTeam.logoPathURL}
                          alt={`${game && game.guestTeam} logo`}
                          className="w-36 h-36"
                        />
                        <p className="text-2xl font-extrabold">
                          {game && game.guestTeam.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full tabs rounded-none  tabs-box flex justify-around bg-white  text-white dark:text-black border-white dark:bg-custom-gray dark:border-black p-0 border-0">
                  <input
                    type="radio"
                    name="game_tabs"
                    className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
                    aria-label="Stats leaders"
                    checked={hash === "" || hash === "#stats-leaders"}
                    onChange={() => setHash("#stats-leaders")}
                  />
                  <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
                    {(hash === "" || hash === "#stats-leaders") && (
                      <GameInfo
                        gameId={game.id}
                        homeTeamId={game.homeTeam.id}
                        guestTeamId={game.guestTeam.id}
                      />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="game_tabs"
                    className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
                    aria-label="Teams stats"
                    checked={hash === "#team-stats"}
                    onChange={() => setHash("#team-stats")}
                  />
                  <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
                    {hash === "#team-stats" && (
                      <TeamStats
                        gameId={game.id}
                        homeTeamId={game.homeTeam.id}
                        guestTeamId={game.guestTeam.id}
                      />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="game_tabs"
                    className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
                    aria-label={`${game && game.homeTeam.name} players stats`}
                    checked={hash === "#home-players"}
                    onChange={() => setHash("#home-players")}
                  />
                  <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
                    {hash === "#home-players" && (
                      <PlayersStats
                        teamId={game!.homeTeam.id}
                        teamName={game!.homeTeam.name}
                        gameId={game.id}
                      />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="game_tabs"
                    className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
                    aria-label={`${game && game.guestTeam.name} players stats`}
                    checked={hash === "#away-players"}
                    onChange={() => setHash("#away-players")}
                  />
                  <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
                    {hash === "#away-players" && (
                      <PlayersStats
                        teamId={game!.guestTeam.id}
                        teamName={game!.guestTeam.name}
                        gameId={game.id}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GamePage;
