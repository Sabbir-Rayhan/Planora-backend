export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}