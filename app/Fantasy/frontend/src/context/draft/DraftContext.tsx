import { createContext } from "react";

type DraftContextType = {
  currentTurn: string;
  deadline: string;
  draftStarted: boolean;
  isMyTurn: () => boolean;
};

export const DraftContext = createContext<DraftContextType>(
  {} as DraftContextType,
);
