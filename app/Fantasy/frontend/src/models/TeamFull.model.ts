import { Coach } from "./Coach.modal";
import { Player } from "./Player.model";

export type TeamFull = {
  id: number;
  position: number;
  club: string;
  gp: number;
  won: number;
  lost: number;
  home: string;
  away: string;
  plusMinus: string;
  logoUrl: string;
  players: Player[];
  coaches: Coach[];
};
