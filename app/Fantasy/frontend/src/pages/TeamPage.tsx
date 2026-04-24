import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, type FC } from "react";
import Players from "../components/TeamPage/Players";
import Coaches from "../components/TeamPage/Coaches";
import Games from "../components/TeamPage/Games";
import PlayersStats from "../components/TeamPage/PlayersStats";
import TeamStats from "../components/TeamPage/TeamStats";
import type { TeamStanding } from "../models/TeamStanding";

const TeamPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const team = location.state?.team as TeamStanding;
  const position = location.state?.index as number;

  const hash = location.hash;

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
  };

  useEffect(() => {
    const allowed = [
      "",
      "#players",
      "#coaches",
      "#games",
      "#players-stats",
      "#team-stats",
    ];

    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true });
    }
  }, [hash, navigate]);

  return (
    <>
      <div className="pt-14 h-fit w-screen font-palanquin min-h-screen ">
        <div className="h-fit flex bg-phoenix/95 max-md:flex-col justify-between items-center gap-5 p-20 max-md:p-0 max-md:justify-around max-md:pt-5">
          <div className="flex max-sm:flex-col gap-5 justify-center items-center">
            <img
              src={`${team?.logoPathUrl}`}
              alt={`${team?.teamName.toLowerCase()} logo`}
              className="w-40 h-40 "
            />
            <p className="text-5xl max-sm:text-4xl font-extrabold text-nowrap">
              {team?.teamName}
            </p>
          </div>
          <p className="text-2xl font-bold">
            Position: <span>{position + 1}</span>
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="text-center">
              <p>Won</p>
              <br />
              <p className="text-4xl font-palanquin">{team?.wins}</p>
            </div>
            <hr className="rotate-90 w-20 bg-black" />
            <div className="text-center">
              <p>Lost</p>
              <br />
              <p className="text-4xl font-palanquin">{team?.losses}</p>
            </div>
          </div>
        </div>

        <div className="w-full tabs rounded-none  tabs-box flex justify-around bg-white   border-white dark:bg-custom-gray dark:border-black p-0 border-0">
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Players"
            checked={hash === "" || hash === "#players"}
            onChange={() => setHash("#players")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "" ||
              (hash === "#players" && (
                <Players teamId={team.teamId} teamName={team.teamName} />
              ))}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
            aria-label="Coaches"
            checked={hash === "#coaches"}
            onChange={() => setHash("#coaches")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#coaches" && <Coaches teamId={team.teamId} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Games"
            checked={hash === "#games"}
            onChange={() => setHash("#games")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#games" && <Games teamId={team.teamId} />}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Players Stats"
            checked={hash === "#players-stats"}
            onChange={() => setHash("#players-stats")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#players-stats" && (
              <PlayersStats teamId={team.teamId} teamName={team.teamName} />
            )}
          </div>
          <input
            type="radio"
            name="game_tabs"
            className="tab bg-phoenix/80 hover:bg-phoenix  flex-1 rounded-none checked:bg-phoenix"
            aria-label="Team Stats"
            checked={hash === "#team-stats"}
            onChange={() => setHash("#team-stats")}
          />
          <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
            {hash === "#team-stats" && (
              <TeamStats
                teamId={team.teamId}
                position={position + 1}
                gamePlayed={team.losses + team.wins}
                gameWon={team.wins}
                gameLost={team.losses}
                winPercentage={
                  ((team.wins / (team.wins + team.losses)) * 100).toFixed(1) +
                  "%"
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
