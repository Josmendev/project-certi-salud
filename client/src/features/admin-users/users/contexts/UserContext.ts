import { createContext } from "react";
import type { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import type { EditUser, ResponseDataUser } from "../types/userTypes";

// Creo el contexto para almacenar valores del usuario
export interface AuthContextProps {
  list: () => Promise<ResponseDataUser | ErrorResponse>;
  modifyUser: (user: EditUser) => Promise<EditUser | ErrorResponse>;
}

// Creo el contexto con los valores por defecto
export const AuthContext = createContext<AuthContextProps | null>(null);
