import type { Player } from "./Player";

export type PlayerGameStats = {
  id: string;
  game: string;
  player: Player;
  points: number;
  made1p: number;
  miss1p: number;
  made2p: number;
  miss2p: number;
  made3p: number;
  miss3p: number;
  assists: number;
  rebounds: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  steals: number;
  turnovers: number;
  pir: number;
  personalFouls: number;
  recievedFouls: number;
  blocks: number;
  recievedBlocks: number;
  technicalFouls: number;
  secondsPlayed: number;
  isStarter: boolean;
};
