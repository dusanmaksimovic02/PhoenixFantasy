import ActivePlayers from "../components/GamePage/ActivePlayers";
import GameInfo from "../components/GamePage/GameInfo";
import type { FC } from "react";

const GamePage: FC = () => {
  return (
    <div className="w-screen h-fit min-h-screen pt-15">
      <GameInfo />
      <ActivePlayers />
    </div>
  );
};

export default GamePage;
