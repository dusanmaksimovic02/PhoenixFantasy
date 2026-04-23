import { createContext } from "react";

type CreateDraftContextType = {
};

export const CreateDraftContext = createContext<CreateDraftContextType>(
  {} as CreateDraftContextType,
);
