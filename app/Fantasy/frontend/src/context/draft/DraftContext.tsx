import type { CoachView, PlayerView } from "../../models/TeamLineUp";
import { createContext } from "react";

type DraftContextType = {
  currentTurn: string;
  deadline: string;
  draftStarted: boolean;
  isMyTurn: boolean;
  pickOrder: any[];
  phase: string;
  availablePlayers: PlayerView[];
  availableCoaches: CoachView[];
};

export const DraftContext = createContext<DraftContextType>(
  {} as DraftContextType,
);
