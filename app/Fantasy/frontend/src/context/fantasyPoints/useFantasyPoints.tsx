import { useContext } from "react";
import { FantasyPointsContext } from "./FantasyPointsContext";

export const useFantasyPoints = () => {
  const context = useContext(FantasyPointsContext);

  if (context === undefined)
    throw new Error(
      "useFantasyPoints must be used within a FantasyPointsProvider",
    );

  return context;
};
