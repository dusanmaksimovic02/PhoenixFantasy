export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  birthDate: Date;
  phoneNumber: string;
  role: string;
};

export type LoginUser = {
  username: string;
  password: string;
};
