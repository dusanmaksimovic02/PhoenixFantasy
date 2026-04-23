import type { CoachView } from "../../models/TeamLineUp";
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
  availableCoaches: CoachView[];
};

export const DraftContext = createContext<DraftContextType>(
  {} as DraftContextType,
);
