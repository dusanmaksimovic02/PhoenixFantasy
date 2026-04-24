import type { ShotStat } from "./ShotStat";

export type PlayerStats = {
  playerId: string;

  jerseyNumber: string;
  fullName: string;

  points: number;
  assists: number;
  rebounds: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  steals: number;
  turnovers: number;
  blocks: number;
  receivedBlocks: number;
  personalFouls: number;
  receivedFouls: number;
  technicalFouls: number;
  pir: number;

  freeThrow: ShotStat;
  twoPoint: ShotStat;
  threePoint: ShotStat;
};
