import { useLocation, useNavigate } from "react-router-dom";
import GameInfo from "../components/GamePage/GameInfo";
import PlayersStats from "../components/GamePage/PlayersStats";
import TeamStats from "../components/GamePage/TeamStats";
import { useEffect, useState, type FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGameById } from "../services/StatsService";
import Loading from "../components/Loading";
import * as signalR from "@microsoft/signalr";

const FANTASY_API_URL = "https://localhost:7035";

type GameState = "SCHEDULED" | "LIVE" | "FINISHED";

const GamePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const gameId = location.state.gameId;
  const hash = location.hash;

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameById(gameId),
  });

  const [liveScore, setLiveScore] = useState({ home: 0, guest: 0 });
  const [status, setStatus] = useState<GameState>("SCHEDULED");

  // set initial status from DB data once loaded
  useEffect(() => {
    if (!game) return;
    if (game.gameEnded) setStatus("FINISHED");
    else if (game.homeTeamScore > 0 || game.guestTeamScore > 0) setStatus("LIVE");
    else setStatus("SCHEDULED");
  }, [game]);

  useEffect(() => {
    if (!gameId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${FANTASY_API_URL}/gameScoreHub`)
      .withAutomaticReconnect()
      .build();

    // game just started — flip to LIVE and refresh player stats
    connection.on("GameStarted", (data) => {
      if (data.gameId !== gameId) return;
      setStatus("LIVE");
      invalidatePlayerStats();
    });

    // score updated — update displayed score and refresh stats
    connection.on("GameScoreUpdated", (data) => {
      if (data.gameId !== gameId) return;
      setLiveScore({ home: data.homeTeamScore, guest: data.guestTeamScore });
      setStatus((prev) => (prev === "FINISHED" ? prev : "LIVE"));
      invalidatePlayerStats();
    });

    // game ended — final score and flip to FINISHED
    connection.on("GameEnded", (data) => {
      if (data.gameId !== gameId) return;
      setLiveScore({ home: data.homeTeamScore, guest: data.guestTeamScore });
      setStatus("FINISHED");
      invalidatePlayerStats();
    });

    connection.start()
      .then(async () => {
        console.log("[SignalR] Connected to gameScoreHub");
        await connection.invoke("JoinGame", gameId);
      })
      .catch((err) => console.error("[SignalR] Error:", err));

    return () => {
      connection.stop();
    };
  }, [gameId]);

  const invalidatePlayerStats = () => {
    if (!game) return;
    // invalidate all query keys used by child components
    queryClient.invalidateQueries({ queryKey: ["homeTeamPlayersStats"] });
    queryClient.invalidateQueries({ queryKey: ["guestTeamPlayersStats"] });
    queryClient.invalidateQueries({ queryKey: ["teamPlayersStats"] });
  };

  const setHash = (value: string) => {
    navigate({ hash: value }, { replace: true, state: location.state });
  };

  useEffect(() => {
    const allowed = ["", "#stats-leaders", "#team-stats", "#home-players", "#away-players"];
    if (!allowed.includes(hash)) {
      navigate({ hash: "" }, { replace: true, state: location.state });
    }
  }, [hash, navigate]);

  if (isLoading) return <Loading />;
  if (!game) return null;

  const homeScore = liveScore.home || game.homeTeamScore || 0;
  const guestScore = liveScore.guest || game.guestTeamScore || 0;
  const homeWin = homeScore > guestScore;
  const guestWin = guestScore > homeScore;

  return (
    <div className="pt-14 min-h-screen w-screen font-palanquin">

     
      <div className="h-fit flex max-sm:flex-col justify-between items-center gap-5 bg-phoenix/95 p-5 text-white max-sm:justify-around">
        <div className="w-full flex max-sm:flex-col justify-between items-center gap-5 p-5 rounded-3xl">

        
          <div className="flex justify-center items-center flex-col gap-3 text-center">
            <img src={game.homeTeam.logoPathURL} alt="home logo" className="w-36 h-36" />
            <p className="text-2xl font-extrabold">{game.homeTeam.name}</p>
          </div>

          
          <div className="flex flex-col gap-5 items-center">
            {(homeScore > 0 || guestScore > 0) && (
              <div className="flex text-5xl">
                <div className={`border-2 border-r-0 p-5 rounded-l-2xl ${homeWin ? "bg-success" : "bg-error"}`}>
                  {homeScore}
                </div>
                <div className={`border-2 p-5 rounded-r-2xl ${guestWin ? "bg-success" : "bg-error"}`}>
                  {guestScore}
                </div>
              </div>
            )}

            <div className="flex flex-col text-center font-semibold gap-1">
              <p>Date: {game.dateTime?.split("T")[0]}</p>
              <p>Time: {game.dateTime?.split("T")[1]?.slice(0, 5)}</p>
              <p>Venue: {game.venue}</p>

              <div className="mt-2">
                {status === "LIVE" && (
                  <span className="px-4 py-1 bg-red-600 text-white font-bold rounded-full animate-pulse">
                    🔴 LIVE
                  </span>
                )}
                {status === "FINISHED" && (
                  <span className="px-4 py-1 bg-gray-600 text-white font-bold rounded-full">
                    ✅ Finished — Round {game.round}
                  </span>
                )}
                {status === "SCHEDULED" && (
                  <span className="px-4 py-1 bg-yellow-500 text-black font-bold rounded-full">
                     🕒 Scheduled — Round {game.round}
                  </span>
                )}
              </div>
            </div>
          </div>

          
          <div className="flex justify-center items-center flex-col gap-3 text-center">
            <img src={game.guestTeam.logoPathURL} alt="away logo" className="w-36 h-36" />
            <p className="text-2xl font-extrabold">{game.guestTeam.name}</p>
          </div>
        </div>
      </div>

     
      <div className="w-full tabs rounded-none tabs-box flex justify-around bg-white border-white dark:bg-custom-gray dark:border-black p-0 border-0">
        <input
          type="radio"
          name="game_tabs"
          className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
          aria-label="Stats Leaders"
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
          className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
          aria-label="Team Stats"
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
          aria-label="Home Players"
          checked={hash === "#home-players"}
          onChange={() => setHash("#home-players")}
        />
        <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
          {hash === "#home-players" && (
            <PlayersStats
              teamId={game.homeTeam.id}
              teamName={game.homeTeam.name}
              gameId={game.id}
            />
          )}
        </div>

        <input
          type="radio"
          name="game_tabs"
          className="tab bg-phoenix/80 hover:bg-phoenix flex-1 rounded-none checked:bg-phoenix"
          aria-label="Away Players"
          checked={hash === "#away-players"}
          onChange={() => setHash("#away-players")}
        />
        <div className="tab-content border-none p-6 bg-white dark:bg-custom-gray">
          {hash === "#away-players" && (
            <PlayersStats
              teamId={game.guestTeam.id}
              teamName={game.guestTeam.name}
              gameId={game.id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;