import { type FC } from "react";
import FantasyPlayerInLeague from "../components/CreateDraftLeague/FantasyPlayerInLeague";
import { useLocation } from "react-router-dom";
import JoinCodeBox from "../components/CreateDraftLeague/JoinCodeBox";
import DeleteLeagueBox from "../components/CreateDraftLeague/DeleteLeagueBox";
import DraftChat from "../components/CreateDraftLeague/DraftChat";
import StartDraft from "../components/CreateDraftLeague/StartDraft";
import { DraftProvider } from "../context/draft/DraftProvider";
import { useAuth } from "../context/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  getDraftSessionId,
  isDraftStarted,
} from "../services/CreateDraftLeagueService";
import DraftArea from "../components/CreateDraftLeague/DraftArea";

const CreateDraftLeague: FC = () => {
  const location = useLocation();
  const res = location.state?.res as {
    leagueId: string;
    leagueName: string;
    joinCode: string;
    teamId: string;
    teamName: string;
  };

  const { id } = useAuth();

  const { data: isLeagueStarted } = useQuery({
    queryKey: ["isLeagueStarted"],
    queryFn: () => isDraftStarted(id),
    refetchInterval: 3000,
  });

  const { data: draftId } = useQuery({
    queryKey: ["draftId"],
    queryFn: () => getDraftSessionId(res.leagueId),
    refetchInterval: 3000,
  });

  return (
    <div className="w-full h-fit min-h-screen flex justify-center items-center mt-10 max-lg:flex-col max-lg:mt-20">
      <div className="flex-1 flex lg:flex-col gap-10 px-5 max-md:mb-5 max-md:grid max-md:grid-cols-2">
        <StartDraft leagueId={res.leagueId} />
        <DeleteLeagueBox leagueId={res.leagueId} />
        <FantasyPlayerInLeague leagueId={res.leagueId} />
      </div>
      {isLeagueStarted && draftId && (
        <DraftProvider
          draftId={draftId ? draftId : ""}
          myTeamId={res.teamId}
          leagueId={res.leagueId}
        >
          <DraftArea
            teamName={res.teamName}
            teamId={res.teamId}
            draftId={draftId}
          />
        </DraftProvider>
      )}
      <div className="flex-1 p-5 flex flex-col gap-10 max-md:justify-center max-md:items-center">
        <JoinCodeBox joinCode={res.joinCode} />
        <div className="w-full h-125 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <DraftChat leagueId={res.leagueId} />
        </div>
      </div>
    </div>
  );
};

export default CreateDraftLeague;
