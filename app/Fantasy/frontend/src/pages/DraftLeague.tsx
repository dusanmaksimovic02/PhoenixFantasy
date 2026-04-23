import { useState, type FC } from "react";
import LeagueLeaderboard from "../components/DraftLeague/LeagueLeaderboard";
import DraftLeagueCourt from "../components/DraftLeague/DraftLeagueCourt";
import RoundInfoPanel from "../components/DraftLeague/RoundInfoPanel";

const DraftLeague: FC = () => {
  const [captainId, setCaptainId] = useState<string | null>(null);

  const handleCaptainToggle = (playerId: string) => {
    setCaptainId((prev) => (prev === playerId ? null : playerId));
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start gap-6 px-6 py-10">
      
      <div className="flex-1 max-w-xs pt-16">
        <LeagueLeaderboard />
      </div>

    
      <div className="flex-3 flex justify-center">
        <DraftLeagueCourt
          teamName="KK KAKOO"
          captainId={captainId}
          onCaptainToggle={handleCaptainToggle}
        />
      </div>

      {/* right - round info */}
      <div className="flex-1 max-w-xs pt-16">
        <RoundInfoPanel captainId={captainId} />
      </div>
    </div>
  );
};

export default DraftLeague;