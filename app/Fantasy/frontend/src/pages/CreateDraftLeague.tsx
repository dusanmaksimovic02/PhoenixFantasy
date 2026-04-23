import { type FC } from "react";
import { useLocation } from "react-router-dom";
import { CreateDraftProvider } from "../context/createDraft/CreateDraftProvider";
import CreateDraftLeagueMain from "../components/CreateDraftLeague/CreateDraftLeagueMain";

const CreateDraftLeague: FC = () => {
  const location = useLocation();
  const res = location.state?.res as {
    leagueId: string;
    leagueName: string;
    joinCode: string;
    teamId: string;
    teamName: string;
  };

  return (
    <CreateDraftProvider
      draftId={""}
      myTeamId={res.teamId}
      leagueId={res.leagueId}
    >
      <CreateDraftLeagueMain
        leagueId={res.leagueId}
        teamName={res.teamName}
        teamId={res.teamId}
        joinCode={res.joinCode}
      />
    </CreateDraftProvider>
  );
};

export default CreateDraftLeague;
