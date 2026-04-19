import { useDraft } from "../../context/draft/useDraft";
import { type FC } from "react";
import FantasyCourt from "./FantasyCourt";

interface DraftAreaProps {
  teamName: string;
  teamId: string;
}

const DraftArea: FC<DraftAreaProps> = ({ teamName, teamId }) => {
  const { isMyTurn, deadline } = useDraft();
  return (
    <div className="flex-3 flex flex-col justify-center items-center max-md:m-5 max-md:gap-5">
      <div className="flex">
        <h1>{teamName}</h1>
        {isMyTurn() ? (
          <div className="flex justify-center items-center">
            <h3 className="text-green-500">Your Turn</h3>
            <h3>Time left: {new Date(deadline).toLocaleTimeString()}</h3>
          </div>
        ) : (
          <h3 className="text-red-500">Wait for Your Turn</h3>
        )}
      </div>
      <FantasyCourt teamId={teamId} />
    </div>
  );
};

export default DraftArea;
