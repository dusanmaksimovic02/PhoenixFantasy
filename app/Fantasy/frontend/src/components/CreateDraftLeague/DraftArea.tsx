import { useDraft } from "../../context/draft/useDraft";
import { useEffect, useState, type FC } from "react";
import FantasyCourt from "./FantasyCourt";

interface DraftAreaProps {
  teamName: string;
  teamId: string;
  draftId: string;
}

const DraftArea: FC<DraftAreaProps> = ({ teamName, teamId, draftId }) => {
  const { isMyTurn, deadline } = useDraft();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const diff = Math.floor(
        (new Date(deadline).getTime() - new Date().getTime()) / 1000,
      );
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);
  return (
    <div className="flex-3 flex flex-col justify-center items-center max-md:m-5 max-md:gap-5">
      <div className="flex justify-center items-center gap-3">
        <h1>{teamName}</h1>
        {isMyTurn ? (
          <>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full animate-pulse">
              Your Turn
            </span>
            <div
              className={`text-xl font-mono ${timeLeft < 10 ? "text-red-500" : ""}`}
            >
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </>
        ) : (
          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
            Waiting...
          </span>
        )}
      </div>
      <FantasyCourt teamId={teamId} draftId={draftId} />
    </div>
  );
};

export default DraftArea;
