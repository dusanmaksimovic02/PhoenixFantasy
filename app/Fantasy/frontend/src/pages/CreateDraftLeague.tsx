import SelectPlayerOrder from "../components/CreateDraftLeague/SelectPlayerOrder";
import { type FC } from "react";
// import { useParams } from "react-router-dom";
import FantasyCourt from "../components/CreateDraftLeague/FantasyCourt";
// import FantasyBench from "../components/CreateDraftLeague/FantasyBench";
import FantasyPlayerInLeague from "../components/CreateDraftLeague/FantasyPlayerInLeague";
import { useLocation } from "react-router-dom";
import JoinCodeBox from "../components/CreateDraftLeague/JoinCodeBox";
import DeleteLeagueBox from "../components/CreateDraftLeague/DeleteLeagueBox";

const CreateDraftLeague: FC = () => {
  // const { leagueName, code } = useParams();
  const location = useLocation();
  const res = location.state?.res as {
    leagueId: string;
    leagueName: string;
    joinCode: string;
    teamId: string;
    teamName: string;
  };

  return (
    <div className="w-full h-fit min-h-screen flex justify-center items-center mt-10 max-lg:flex-col max-lg:mt-20">
      <div className="flex-1 flex lg:flex-col gap-10 px-5 max-md:mb-5 max-md:grid max-md:grid-cols-2">
        <SelectPlayerOrder />
        <DeleteLeagueBox leagueId={res.leagueId} />
        <FantasyPlayerInLeague leagueId={res.leagueId} />
      </div>
      <div className="flex-3 flex flex-col justify-center items-center max-md:m-5 max-md:gap-5">
        <h1>{res.teamName}</h1>
        <FantasyCourt />
        {/* <FantasyBench /> */}
      </div>
      <div className="flex-1 p-5 flex lg:flex-col gap-10 max-md:justify-center max-md:items-center">
        <JoinCodeBox joinCode={res.joinCode} />
        <SelectPlayerOrder />
      </div>
    </div>
  );
};

export default CreateDraftLeague;
