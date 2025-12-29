import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameInfo from "../components/GamePage/GameInfo";
import PlayersStats from "../components/TeamPage/PlayersStats";
import TeamStats from "../components/GamePage/TeamStats";
import { useEffect, type FC } from "react";

const GamePage: FC = () => {
  const { team1, team2 } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const hash = location.hash;

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true });
  };

  useEffect(() => {
    const allowed = [
      "",
      "#game-info",
      "#team-stats",
      "#home-players",
      "#away-players",
    ];

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true });
    }
  }, [hash, navigate]);

  const game = {
    homeTeam: team1,
    homeLogo:
      "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg",
    awayTeam: team2,
    awayLogo:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
    date: "2024-10-15",
    time: "19:00",
    arena: "Footprint Center",
    played: true,
    result: { homeScore: 112, awayScore: 105 },
    referees: ["ref1", "ref2", "ref3"],
  };

  const players = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    firstName: `Player${index + 1}`,
    lastName: `Suns`,
    team: "Phoenix Suns",
    country: "USA",
    age: 20 + index,
    position: ["PG", "SG", "SF", "PF", "C"][index % 5],
    height: `${6 + (index % 3)}'${5 + (index % 6)}`,
    weight: `${200 + index * 5} lbs`,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg",
    gamesPlayed: 50 + index,
    pointsPerGame: 10 + index * 0.5,
    reboundsPerGame: 5 + index * 0.3,
    assistsPerGame: 2 + index * 0.2,
    stealsPerGame: 1 + index * 0.1,
    blocksPerGame: 0.5 + index * 0.05,
    fieldGoalPercentage: 45 + index * 0.5,
    fieldGoalMade: 300 + index * 5,
    fieldGoalMiss: 150 + index * 3,
    threePointPercentage: 35 + index * 0.3,
    threePointMade: 120 + index * 2,
    threePointMiss: 60 + index * 2,
    twoPointsPercentage: 40 + index * 0.3,
    twoPointMade: 180 + index * 3,
    twoPointMiss: 90 + index * 2,
    freeThrowPercentage: 80 + index * 0.2,
    freeThrowMade: 100 + index,
    freeThrowMiss: 20 + index,
    turnoversPerGame: 2 + index * 0.1,
    minutesPerGame: 20 + index,
    jerseyNumber: 10 + (index % 30),
    plusMinusIndex: 5 - index * 0.5,
    pir:
      10 +
      index * 0.5 +
      (5 + index * 0.3) +
      (2 + index * 0.2) +
      (1 + index * 0.1) +
      (0.5 + index * 0.05) -
      (2 + index * 0.1),
  }));

  return (
    <>
      <div className="pt-14 h-fit w-screen font-palanquin min-h-screen">
        <div className=" h-fit w-full  max-sm:h-svh">
          <div className="h-fit flex max-sm:flex-col justify-between items-center gap-5 bg-phoenix/95 p-5 text-white dark:text-black max-sm:h-svh max-sm:justify-around">
            <div className="w-full flex max-sm:flex-col justify-between items-center gap-5 p-5  rounded-3xl ">
              <div className="flex justify-center items-center flex-col gap-3 text-center">
                <img
                  src={game.homeLogo}
                  alt={`${game.homeTeam} logo`}
                  className="w-36 h-36"
                />
                <p className="text-2xlfont-extrabold">{game.homeTeam}</p>
              </div>
              <div className=" flex flex-col dark:text-black gap-5">
                {game.result && (
                  <div className=" flex text-5xl">
                    <div
                      className={`border-4 dark:border-black border-r-0 p-5 ${
                        game.result.homeScore > game.result.awayScore
                          ? "bg-success"
                          : "bg-error-dark"
                      }`}
                    >
                      {game.result.homeScore}
                    </div>
                    <div
                      className={`border-4 dark:border-black p-5 ${
                        game.result.awayScore > game.result.homeScore
                          ? "bg-success"
                          : "bg-error-dark"
                      }`}
                    >
                      {game.result.awayScore}
                    </div>
                  </div>
                )}
                <div className="flex flex-col text-center font-semibold">
                  <p>Time: {game.time}</p>
                  <p>Date: {game.date}</p>
                  <p>Arena: {game.arena}</p>
                  <p>
                    Referees:{" "}
                    {game.referees.map((ref) => (
                      <>{ref} </>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col gap-3 text-center">
                <img
                  src={game.awayLogo}
                  alt="home logo"
                  className="w-36 h-36"
                />
                <p className="text-2xl font-extrabold">{game.awayTeam}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full tabs rounded-none  tabs-box flex justify-around bg-white  text-white dark:text-black border-white dark:bg-custom-gray dark:border-black p-0 border-0">
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
            aria-label="Game info"
            checked={hash === "" || hash === "#game-info"}
            onChange={() => setHash("#game-info")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {(hash === "" || hash === "#game-info") && <GameInfo />}
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
            {hash === "#team-stats" && <TeamStats />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
            aria-label={`${game.homeTeam} players stats`}
            checked={hash === "#home-players"}
            onChange={() => setHash("#home-players")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#home-players" && <PlayersStats players={players} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label={`${game.awayTeam} players stats`}
            checked={hash === "#away-players"}
            onChange={() => setHash("#away-players")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#away-players" && <PlayersStats players={players} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
