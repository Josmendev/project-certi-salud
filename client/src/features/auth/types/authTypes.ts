import type { IUser } from "./User";

// Defino los tipos de INPUT para el modulo de Auth
export type AuthLoginUser = {
  username: string;
  password: string;
};

export type AuthConfirmUser = {
  newPassword: string;
  repeatPassword: string;
};

export type TokenLogoutUser = string;

// Defino el tipo de OUTPUT para el modulo de Auth
export type AuthResponseUser = IUser & { token: string };
