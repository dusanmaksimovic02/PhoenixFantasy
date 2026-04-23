import { useContext } from "react";
import { CreateDraftContext } from "./CreateDraftContext";

export const useCreateDraft = () => {
  const context = useContext(CreateDraftContext);

  if (context === undefined)
    throw new Error("useCreateDraft must be used within a DraftProvider");

  return context;
};
