import { useState, type FC } from "react";
import { useParams } from "react-router-dom";
import PlusMinusButtons from "./PlusMinusButtons";

const GameInfo: FC = () => {
  const { team1, team2 } = useParams();
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [homeCouchTechnical, setHomeCouchTechnical] = useState<number>(0);
  const [homeBenchTechnical, setHomeBenchTechnical] = useState<number>(0);
  const [awayCouchTechnical, setAwayCouchTechnical] = useState<number>(0);
  const [awayBenchTechnical, setAwayBenchTechnical] = useState<number>(0);

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
    result: { homeScore: 59, awayScore: 48 },
  };
  return (
    <div className="pt-7 pl-7 pr-10">
      <div className="h-fit w-full max-sm:h-svh flex max-sm:flex-col justify-between items-center gap-5 p-7 bg-surface-light dark:bg-surface-dark rounded-4xl max-sm:justify-around">
        <div className="w-full flex flex-1 max-sm:flex-col justify-between items-center gap-5 rounded-3xl ">
          <div>
            <div className="flex justify-center items-center gap-10 text-center">
              <img
                src={game.homeLogo}
                alt={`${game.homeTeam} logo`}
                className="w-35 h-35"
              />
              <div className="flex flex-col">
                <p className="text-3xl font-extrabold">{game.homeTeam}</p>
                <p
                  className={`text-6xl font-bold ${
                    game.result.homeScore > game.result.awayScore
                      ? "text-phoenix"
                      : ""
                  }`}
                >
                  {game.result.homeScore}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-around h-full p-3 gap-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <p>Couch Technical</p>
                  <p>{homeCouchTechnical}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    setHomeCouchTechnical(homeCouchTechnical + 1)
                  }
                  onMinusClick={() =>
                    setHomeCouchTechnical(homeCouchTechnical - 1)
                  }
                  minusDisable={() => homeCouchTechnical <= 0}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <p>Bench Technical</p>
                  <p>{homeBenchTechnical}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    setHomeBenchTechnical(homeBenchTechnical + 1)
                  }
                  onMinusClick={() =>
                    setHomeBenchTechnical(homeBenchTechnical - 1)
                  }
                  minusDisable={() => homeBenchTechnical <= 0}
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-2 flex-col items-center justify-center gap-1">
            <div className="w-full flex justify-center">
              <p
                className={`text-4xl w-fit px-7 border-2 border-black dark:border-white rounded-4xl f font-bold ${
                  isStopped ? "text-red-500" : ""
                }`}
              >
                6:34
              </p>
            </div>
            <p className="text-2xl font-semibold">3rd quarter</p>

            {!isStart ? (
              <button
                disabled={isStart}
                onClick={() => setIsStart(true)}
                className="btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl"
              >
                Start Game
              </button>
            ) : (
              <button
                className={`btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl
                    ${
                      isStopped
                        ? "bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600"
                        : ""
                    }`}
                onClick={() => setIsStopped(!isStopped)}
              >
                {isStopped ? "start" : "stop"}
              </button>
            )}
          </div>
          <div>
            <div className="flex flex-1 justify-center items-center gap-10 text-center">
              <div>
                <p className="text-3xl font-extrabold">{game.awayTeam}</p>
                <p
                  className={`text-6xl font-bold ${
                    game.result.homeScore < game.result.awayScore
                      ? "text-phoenix"
                      : ""
                  }`}
                >
                  {game.result.awayScore}
                </p>
              </div>
              <img src={game.awayLogo} alt="home logo" className="w-35 h-35" />
            </div>
            <div className="flex flex-col justify-around h-full p-3 gap-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <p>Couch Technical</p>
                  <p>{awayCouchTechnical}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    setAwayCouchTechnical(awayCouchTechnical + 1)
                  }
                  onMinusClick={() =>
                    setAwayCouchTechnical(awayCouchTechnical - 1)
                  }
                  minusDisable={() => awayCouchTechnical <= 0}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <p>Bench Technical</p>
                  <p>{awayBenchTechnical}</p>
                </div>
                <PlusMinusButtons
                  onPlusClick={() =>
                    setAwayBenchTechnical(awayBenchTechnical + 1)
                  }
                  onMinusClick={() =>
                    setAwayBenchTechnical(awayBenchTechnical - 1)
                  }
                  minusDisable={() => awayBenchTechnical <= 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
