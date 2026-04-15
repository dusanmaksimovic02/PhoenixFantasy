import SelectPlayerOrder from "../components/CreateDraftLeague/SelectPlayerOrder";
import { type FC } from "react";
// import { useParams } from "react-router-dom";
import FantasyCourt from "../components/CreateDraftLeague/FantasyCourt";
// import FantasyBench from "../components/CreateDraftLeague/FantasyBench";
import FantasyPlayerInLeague from "../components/CreateDraftLeague/FantasyPlayerInLeague";
import { useLocation } from "react-router-dom";

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
    <div className="w-full h-fit min-h-screen flex justify-center items-center mt-10">
      <div className="flex-1 flex flex-col px-5">
        <div className="flex flex-col gap-10">
          <SelectPlayerOrder />
          <FantasyPlayerInLeague leagueId={res.leagueId} />
        </div>
        <div></div>
      </div>
      <div className="flex-3 flex flex-col justify-center items-center">
        <h1>{res.teamName}</h1>
        <FantasyCourt />
        {/* <FantasyBench /> */}
      </div>
      <div className="flex-1 p-5 flex flex-col gap-10">
        <div className="border-2 rounded-2xl gap-5 flex flex-col p-5 text-center">
          <p>Join League Code</p>
          <h3>{res.joinCode}</h3>
        </div>
        <SelectPlayerOrder />
      </div>
    </div>
  );
};

export default CreateDraftLeague;
