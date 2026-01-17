import TeamTable from "../components/GamePage/TeamTable";
import ActivePlayers from "../components/GamePage/ActivePlayers";
import GameInfo from "../components/GamePage/GameInfo";
import type { FC } from "react";
import { useParams } from "react-router-dom";

const GamePage: FC = () => {
  const { team1, team2 } = useParams();
  return (
    <div className="w-screen h-fit min-h-screen pt-15">
      <GameInfo />
      <ActivePlayers />
      <TeamTable team={team1!} />
      <TeamTable team={team2!} />
    </div>
  );
};

export default GamePage;
