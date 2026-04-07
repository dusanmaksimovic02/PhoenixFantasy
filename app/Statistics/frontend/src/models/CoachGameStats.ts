import type { Coach } from "./Coach";
import type { Game } from "./Game";

export type CoachGameStats = {
  id: string;
  game: Game;
  coach: Coach;
  coachTechnicalFouls: number;
  benchTechnicalFouls: number;
  difference: number;
};
