import { useContext } from "react";
import { FantasyPointsContext } from "./FantasyPointsContext";

export const useAuth = () => {
  const context = useContext(FantasyPointsContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
