type ShootingStats = {
  points: number;
  oneMade: number;
  oneAttempt: number;
  twoMade: number;
  twoAttempt: number;
  threeMade: number;
  threeAttempt: number;
};

type ReboundStats = {
  total: number;
  offensive: number;
  defensive: number;
};

type DefenseStats = {
  blocksFor: number;
  blocksAgainst: number;
  steals: number;
  turnovers: number;
};

type FoulStats = {
  committed: number;
  drawn: number;
  technical: number;
};

export type StatsState = {
  shooting: ShootingStats;
  rebounds: ReboundStats;
  defense: DefenseStats;
  fouls: FoulStats;
  assists: number;
};
