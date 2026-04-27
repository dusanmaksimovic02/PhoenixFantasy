import type { FantasyLeague } from "../../models/FantasyLeague";
import { createContext } from "react";

type FantasyPointsContextType = {
  league: FantasyLeague;
};

export const FantasyPointsContext = createContext<FantasyPointsContextType>(
  {} as FantasyPointsContextType,
);
