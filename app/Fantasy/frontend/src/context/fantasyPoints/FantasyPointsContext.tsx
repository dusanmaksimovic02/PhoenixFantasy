import { createContext } from "react";

type FantasyPointsContextType = {};

export const FantasyPointsContext = createContext<FantasyPointsContextType>(
  {} as FantasyPointsContextType,
);
