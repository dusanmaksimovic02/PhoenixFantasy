import { type FC } from "react";
import { useLocation } from "react-router-dom";
import { FantasyPointsProvider } from "../context/fantasyPoints/FantasyPointsProvider";
import DraftLeagueMain from "../components/DraftLeague/DraftLeagueMain";

const DraftLeague: FC = () => {
  const location = useLocation();
  const leagueId = location.state.leagueId;
  const teamId = location.state.teamId;
  const teamName = location.state.teamName;

  return (
    <FantasyPointsProvider teamId={teamId} leagueId={leagueId}>
      <DraftLeagueMain
        leagueId={leagueId}
        teamName={teamName}
        teamId={teamId}
      />
    </FantasyPointsProvider>
  );
};

export default DraftLeague;
