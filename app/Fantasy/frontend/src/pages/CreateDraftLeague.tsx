import SelectPlayerOrder from "../components/CreateDraftLeague/SelectPlayerOrder";
import { type FC } from "react";
// import { useParams } from "react-router-dom";
import FantasyCourt from "../components/CreateDraftLeague/FantasyCourt";
// import FantasyBench from "../components/CreateDraftLeague/FantasyBench";
import FantasyPlayerInLeague from "../components/CreateDraftLeague/FantasyPlayerInLeague";

const CreateDraftLeague: FC = () => {
  // const { leagueName, code } = useParams();
  return (
    <div className="w-full h-fit min-h-screen flex justify-center items-center mt-15">
      <div className="flex-1 flex flex-col  p-5">
        <div className="flex flex-col gap-10">
          <SelectPlayerOrder />
          <FantasyPlayerInLeague />
        </div>
        <div></div>
      </div>
      <div className="flex-3 flex flex-col justify-center items-center">
        <FantasyCourt />
        {/* <FantasyBench /> */}
      </div>
      <div className="flex-1 p-5">
        <SelectPlayerOrder />
      </div>
    </div>
  );
};

export default CreateDraftLeague;
