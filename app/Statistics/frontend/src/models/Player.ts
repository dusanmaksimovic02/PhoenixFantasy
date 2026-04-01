export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  jerseyNumber: string;
  position:
    | "Point Guard"
    | "Shooting Guard"
    | "Small Forward"
    | "Power Forward"
    | "Center";
};
