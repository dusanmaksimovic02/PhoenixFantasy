import { useRef, useState, type FC } from "react";
import PlusMinusButtons from "./PlusMinusButtons";
import type { Game } from "../../models/Game";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

interface GameInfoProps {
  game: Game;
}

const GameInfo: FC<GameInfoProps> = (props) => {
  const [isStopped, setIsStopped] = useState<boolean>(true);
  const [homeCouchTechnical, setHomeCouchTechnical] = useState<number>(0);
  const [homeBenchTechnical, setHomeBenchTechnical] = useState<number>(0);
  const [awayCouchTechnical, setAwayCouchTechnical] = useState<number>(0);
  const [awayBenchTechnical, setAwayBenchTechnical] = useState<number>(0);
  const [time, setTime] = useState<number>(600);
  const [quarter, setQuarter] = useState<number>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const game = {
    homeTeam: props.game.homeTeam.name,
    homeLogo: `${props.game.homeTeam.logoPathURL}`,
    awayTeam: props.game.guestTeam.name,
    awayLogo: `${props.game.guestTeam.logoPathURL}`,
    date: props.game.dateTime?.split("T")[0] ?? "",
    time: props.game.dateTime?.split("T")[1]?.slice(0, 5) ?? "",
    arena: props.game.venue,
    played: false,
    result: { homeScore: 0, awayScore: 0 },
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };
  const startTimer = () => {
    if (intervalRef.current) return;

    setIsStopped(false);

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          stopTimer();

          setQuarter((q) => {
            if (q < 4) {
              return q + 1;
            }
            return q;
          });

          return 600;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsStopped(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="pt-7 px-10 ">
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
                  plusDisabled={() => false}
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
                  plusDisabled={() => false}
                />
              </div>
            </div>
          </div>
          <div className=" flex flex-2 flex-col items-center justify-center gap-1">
            <div className="text-center">
              <p>{game.arena}</p>
              <p>{game.date}</p>
              <p>{game.time}</p>
            </div>
            <div className="w-full flex justify-center gap-5">
              <p
                className={`text-4xl w-fit px-7 border-2 border-black dark:border-white rounded-4xl f font-bold ${
                  isStopped ? "text-red-500" : ""
                }`}
              >
                {formatTime(time)}
              </p>
              <div className="flex flex-col gap-3 mt-2">
                <button
                  className="hover:cursor-pointer"
                  onClick={() => setTime((t) => Math.min(600, t + 1))}
                >
                  <FaAngleUp />
                </button>

                <button
                  className="hover:cursor-pointer"
                  onClick={() => setTime((t) => Math.max(0, t - 1))}
                >
                  <FaAngleDown />
                </button>
              </div>
            </div>
            <p className="text-2xl font-semibold"> {quarter} quarter</p>
            <button
              className={`btn bg-green-600/80 hover:bg-green-600 hover:border-green-600 border-green-600 text-black dark:text-white hover:border-4 hover:cursor-pointer drop-shadow rounded-xl text-xl
                    ${
                      isStopped
                        ? "bg-red-600/80 hover:bg-red-600 hover:border-red-600 border-red-600"
                        : ""
                    }`}
              onClick={() => {
                if (isStopped) {
                  startTimer();
                } else {
                  stopTimer();
                }
              }}
            >
              {isStopped ? "start" : "stop"}
            </button>
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
              <img src={game.awayLogo} alt="away logo" className="w-35 h-35" />
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
                  plusDisabled={() => false}
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
                  plusDisabled={() => false}
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
