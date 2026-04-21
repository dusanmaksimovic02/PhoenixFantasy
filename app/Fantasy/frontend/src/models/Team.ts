import type { Coach } from "./Coach.modal";

export type Team = {
  id: string;
  name: string;
  logoPathURL: string;
  coach : Coach;
};
