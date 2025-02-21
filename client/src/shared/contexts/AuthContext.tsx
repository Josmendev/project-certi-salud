import { createContext } from "react";
import type { DataOfUser } from "../../features/admin-users/users/types/userTypes";
import type {
  AuthConfirmUser,
  AuthLoginUser,
  AuthResponseUser,
} from "../../features/auth/types/authTypes";
import type { ErrorResponse } from "../types/ErrorResponse";

// Creo el contexto para almacenar valores globales de autenticacion
export interface AuthContextProps {
  user: AuthResponseUser | null;
  loading: boolean;
  login: (credentials: AuthLoginUser) => Promise<AuthResponseUser | ErrorResponse>;
  confirmUser: (credentials: AuthConfirmUser) => Promise<AuthResponseUser | ErrorResponse>;
  profileUser: (token: string) => Promise<AuthResponseUser | ErrorResponse>;
  logout: () => Promise<void | ErrorResponse>;
  updateUserInSession: (updatedUser: DataOfUser) => void;
}

// Creo el contexto con los valores por defecto
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {
    throw new Error("EL LOGIN NO SE ENCUENTRA IMPLEMENTADO");
  },
  confirmUser: async () => {
    throw new Error("LA CONFIRMACION DE USUARIO NO SE ENCUENTRA IMPLEMENTADA");
  },
  profileUser: async () => {
    throw new Error("EL PROFILE NO SE ENCUENTRA IMPLEMENTADO");
  },
  logout: async () => {
    throw new Error("EL LOGOUT NO SE ENCUENTRA IMPLEMENTADO");
  },
  updateUserInSession: () => {
    throw new Error("EL LOGOUT NO SE ENCUENTRA IMPLEMENTADO");
  },
});
