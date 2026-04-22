import type { ShotStat } from "./ShotStat";

export type PlayerStats = {
  playerId: string;

  jerseyNumber: string;
  fullName: string;

  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  personalFouls: number;
  pir: number;

  freeThrow: ShotStat;
  twoPoint: ShotStat;
  threePoint: ShotStat;
};
