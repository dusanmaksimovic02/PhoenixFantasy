export type Coach = {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  team: string;
  age: number;
  experience: number;
  role: "Head Coach" | "Assistant Coach" | "Physiotherapist";
  description: string;
  photoUrl: string;
};
