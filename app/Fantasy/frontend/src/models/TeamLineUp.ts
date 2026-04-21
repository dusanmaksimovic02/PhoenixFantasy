export type TeamLineup = {
  starters: PlayerView[];
  bench: PlayerView[];
  captain: PlayerView;
  coach: CoachView;
};

export type PlayerView = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: string;
};

export type CoachView = {
  id: string;
  firstName: string;
  lastName: string;
};
