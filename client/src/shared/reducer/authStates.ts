import type { IUser } from "../../features/auth/types/User";

// Creo el estado inicial del reducer
export const initialStateAuthUser: IUser = {
  userId: null,
  staffId: null,
  username: "",
  password: "",
  token: "",
  isConfirm: false,
  isActive: false,
};
