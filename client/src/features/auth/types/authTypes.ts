import type { IUser } from "./User";

// Defino los tipos de INPUT para el modulo de Auth
export type AuthLoginUser = Pick<IUser, "username" | "password">;
export type AuthConfirmUser = {
  newPassword: string;
  repeatPassword: string;
};
export type AuthLogoutUser = Pick<IUser, "token">;

// Defino el tipo de OUTPUT para el modulo de Auth
export type AuthResponseUser = Pick<IUser, "userId" | "username" | "token" | "isConfirm"> & {
  isActive?: boolean;
};
