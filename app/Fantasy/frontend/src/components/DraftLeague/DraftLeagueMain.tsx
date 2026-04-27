import { useState, type FC } from "react";
import LeagueLeaderboard from "../../components/DraftLeague/LeagueLeaderboard";
import DraftLeagueCourt from "../../components/DraftLeague/DraftLeagueCourt";
import TradePlayerPanel from "../../components/DraftLeague/TradePlayerPanel";
import type { CoachView, PlayerView } from "../../models/TeamLineUp";

interface DraftLeagueMainProps {
  leagueId: string;
  teamName: string;
  teamId: string;
}

const DraftLeagueMain: FC<DraftLeagueMainProps> = ({
  leagueId,
  teamName,
  teamId,
}) => {
  const [selectedFreePlayerCoach, setSelectedFreePlayerCoach] = useState<
    PlayerView | CoachView | null
  >(null);

  return (
    <div
      className="w-full min-h-screen flex max-lg:flex-col max-lg:items-center justify-center items-start gap-6 px-6 py-10 pt-20"
      onClick={() => setSelectedFreePlayerCoach(null)}
    >
      <div className="flex-1 w-fit max-md:w-full pt-5">
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
        className="flex-1 w-fit max-md:w-full pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <TradePlayerPanel
          leagueId={leagueId}
          teamId={teamId}
          onSelectPlayer={(player: PlayerView | CoachView) => {
            setSelectedFreePlayerCoach(player);
          }}
          selectedFreePlayerCoach={selectedFreePlayerCoach}
        />
      </div>
    </div>
  );
};

export default DraftLeagueMain;
