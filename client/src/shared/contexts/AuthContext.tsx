import { createContext } from "react";
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
  logout: () => void;
}

// Creo el contexto con los valores por defecto
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {
    throw new Error("LOGIN NO IMPLEMENTADO");
  },
  confirmUser: async () => {
    throw new Error("CONFIRM_USER NO IMPLEMENTADO");
  },
  logout: async () => {
    throw new Error("LOGOUT NO IMPLEMENTADO");
  },
});
