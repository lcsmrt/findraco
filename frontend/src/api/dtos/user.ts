export type User = {
  id: number;
  name: string;
  email: string;
}

export type RegisterUserRequest = {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
