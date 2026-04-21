import type { Player } from "../../models/Player";
import { createContext } from "react";

type DraftContextType = {
  currentTurn: string;
  deadline: string;
  draftStarted: boolean;
  isMyTurn: boolean;
  pickOrder: any[];
  phase: string;
  availablePlayers: Player[];
};

export const DraftContext = createContext<DraftContextType>(
  {} as DraftContextType,
);
