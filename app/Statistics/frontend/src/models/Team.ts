import type { Coach } from "./Coach";
import type { Player } from "./Player";

export type Team = {
  id: string;
  name: string;
  coach: Coach;
  players: Player[];
};
