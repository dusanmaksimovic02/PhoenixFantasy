import { useState, type FC } from "react";
import LeagueLeaderboard from "../components/DraftLeague/LeagueLeaderboard";
import DraftLeagueCourt from "../components/DraftLeague/DraftLeagueCourt";
// import RoundInfoPanel from "../components/DraftLeague/RoundInfoPanel";
import { useLocation } from "react-router-dom";
import TradePlayerPanel from "../components/DraftLeague/TradePlayerPanel";
import type { CoachView, PlayerView } from "../models/TeamLineUp";

const DraftLeague: FC = () => {
  const location = useLocation();
  const leagueId = location.state.leagueId;
  const teamId = location.state.teamId;
  const teamName = location.state.teamName;
  const [selectedFreePlayerCoach, setSelectedFreePlayerCoach] = useState<
    PlayerView | CoachView | null
  >(null);

  return (
    <div
      className="w-full min-h-screen flex justify-center items-start gap-6 px-6 py-10 pt-20"
      onClick={() => setSelectedFreePlayerCoach(null)}
    >
      <div className="flex-1 max-w-xs pt-5">
        <LeagueLeaderboard leagueId={leagueId} />
      </div>

      <div className="flex-3 flex justify-center">
        <DraftLeagueCourt
          teamName={teamName}
          teamId={teamId}
          selectedFreePlayerCoach={selectedFreePlayerCoach}
          leagueId={leagueId}
        />
      </div>

      <div
        className="flex-1 max-w-xl pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <TradePlayerPanel
          leagueId={leagueId}
          onSelectPlayer={(player: PlayerView | CoachView) => {
            setSelectedFreePlayerCoach(player);
          }}
          selectedFreePlayerCoach={selectedFreePlayerCoach}
        />
      </div>
    </div>
  );
};

export default DraftLeague;
