import type { Game } from "./Game";
import type { Coach } from "./Coach.modal";

export type CoachStats = {
    id : string,
    game : Game,
    caoch : Coach,
    difference : number
}