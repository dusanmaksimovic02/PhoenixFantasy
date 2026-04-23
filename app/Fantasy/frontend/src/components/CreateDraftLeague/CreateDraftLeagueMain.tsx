import type { FC } from "react";
import StartDraft from "./StartDraft";
import DeleteLeagueBox from "./DeleteLeagueBox";
import FantasyPlayerInLeague from "./FantasyPlayerInLeague";
import { DraftProvider } from "../../context/draft/DraftProvider";
import DraftArea from "./DraftArea";
import JoinCodeBox from "./JoinCodeBox";
import DraftChat from "./DraftChat";
import { useQuery } from "@tanstack/react-query";
import {
  getDraftSessionId,
  isDraftStarted,
} from "../../services/CreateDraftLeagueService";

interface CreateDraftLeagueMainProps {
  leagueId: string;
  teamName: string;
  teamId: string;
  joinCode: string;
}

const CreateDraftLeagueMain: FC<CreateDraftLeagueMainProps> = ({
  leagueId,
  teamName,
  teamId,
  joinCode,
}) => {
  const { data: isLeagueStarted } = useQuery({
    queryKey: ["isLeagueStarted"],
    queryFn: () => isDraftStarted(leagueId),
  });

  const { data: draftId } = useQuery({
    queryKey: ["draftId"],
    queryFn: () => getDraftSessionId(leagueId),
  });

  return (
    <div className="w-full h-fit min-h-screen flex justify-center items-center mt-10 max-lg:flex-col max-lg:mt-20">
      <div className="flex-1 flex lg:flex-col gap-10 px-5 max-md:mb-5 max-md:grid max-md:grid-cols-2">
        <StartDraft leagueId={leagueId} />
        <DeleteLeagueBox leagueId={leagueId} />
        <FantasyPlayerInLeague leagueId={leagueId} />
      </div>
      {isLeagueStarted && draftId && (
        <DraftProvider
          draftId={draftId ? draftId : ""}
          myTeamId={teamId}
          leagueId={leagueId}
        >
          <DraftArea teamName={teamName} teamId={teamId} draftId={draftId} />
        </DraftProvider>
      )}
      <div className="flex-1 p-5 flex flex-col gap-10 max-md:justify-center max-md:items-center">
        <JoinCodeBox joinCode={joinCode} />
        <div className="w-full h-125 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <DraftChat leagueId={leagueId} />
        </div>
      </div>
    </div>
  );
};

export default CreateDraftLeagueMain;
