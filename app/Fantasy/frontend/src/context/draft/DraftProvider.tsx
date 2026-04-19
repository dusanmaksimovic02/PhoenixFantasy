import { useEffect, useState, type FC, type ReactNode } from "react";
import { DraftContext } from "./DraftContext";
import { createDraftConnection } from "../../components/CreateDraftLeague/CreateDraftConnection";

type Props = { children: ReactNode; draftId: string; myTeamId: string };

export const DraftProvider: FC<Props> = ({ children, draftId, myTeamId }) => {
  const [pickOrder, setPickOrder] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>("");
  const [draftStarted, setDraftStarted] = useState<boolean>(false);

  useEffect(() => {
    const connection = createDraftConnection(draftId);

    connection.on("DraftStarted", (data) => {
      setDraftStarted(true);
      setPickOrder(data.pickOrder);
      setCurrentIndex(data.currentPickIndex);
      setDeadline(data.pickDeadline);
    });

    connection.on("TurnChanged", (data) => {
      setCurrentIndex(data.currentPickIndex);
      setDeadline(data.pickDeadline);
    });

    connection.on("PlayerPicked", (data) => {
      console.log("Player picked", data);
    });

    connection.on("CoachPicked", (data) => {
      console.log("Coach picked", data);
    });

    return () => {
      connection.stop();
    };
  }, [draftId]);

  const isMyTurn = (): boolean => {
    if (!pickOrder || pickOrder.length === 0) return false;

    const currentTeamId = pickOrder[currentIndex]?.fantasyTeamId;
    return currentTeamId === myTeamId;
  };

  return (
    <DraftContext.Provider
      value={{
        currentTurn: pickOrder[currentIndex]?.fantasyTeamId || "",
        deadline,
        draftStarted,
        isMyTurn,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};
