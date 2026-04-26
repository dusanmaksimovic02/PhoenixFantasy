export type TeamLineup = {
  starters: PlayerView[];
  bench: PlayerView[];
  captain: PlayerView;
  coach: CoachView;
};

export type PlayerView = {
  playerId: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: string;
  avgPoints: number;
  points: number;
  teamName: string;
};

export type CoachView = {
  coachId: string;
  firstName: string;
  lastName: string;
  avgPoints: number;
  points: number;
  teamName: string;
};
