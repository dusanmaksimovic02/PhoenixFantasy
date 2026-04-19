import { useContext } from "react";
import { DraftContext } from "./DraftContext";

export const useDraft = () => {
  const context = useContext(DraftContext);

  if (context === undefined)
    throw new Error("useDraft must be used within a DraftProvider");

  return context;
};
