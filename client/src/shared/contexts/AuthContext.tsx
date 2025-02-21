import { createContext } from "react";
import type { DataOfUser } from "../../features/admin-users/users/types/userTypes";
import type {
  AuthConfirmUser,
  AuthLoginUser,
  AuthResponseUser,
} from "../../features/auth/types/authTypes";

// Creo el contexto para almacenar valores globales de autenticacion
export interface AuthContextProps {
  user: AuthResponseUser | null;
  loading: boolean;
  login: (credentials: AuthLoginUser) => Promise<AuthResponseUser>;
  confirmUser: (credentials: AuthConfirmUser) => Promise<AuthResponseUser>;
  profileUser: (token: string) => Promise<AuthResponseUser>;
  logout: () => Promise<void>;
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
  updateUserInSession: async () => {
    throw new Error("EL LOGOUT NO SE ENCUENTRA IMPLEMENTADO");
  },
});
