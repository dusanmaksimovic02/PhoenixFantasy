import TeamTable from "../components/GamePage/TeamTable";
import ActivePlayers from "../components/GamePage/ActivePlayers";
import GameInfo from "../components/GamePage/GameInfo";
import type { FC } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Game } from "..//models/Game";

const GamePage: FC = () => {
  const { team1, team2 } = useParams();

  const location = useLocation();

  const game = location.state?.game as Game;

  return (
    <div className="w-screen h-fit min-h-screen pt-15">
      <GameInfo game={game} />
      <ActivePlayers />
      <TeamTable team={team1!} />
      <TeamTable team={team2!} />
    </div>
  );
};

export default GamePage;
