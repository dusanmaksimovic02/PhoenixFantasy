export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  birthDate: string;
  phone: string;
  gander: string;
  role: string;
};

export type LoginUser = {
  username: string;
  password: string;
};
