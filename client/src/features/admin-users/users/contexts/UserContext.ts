import { createContext } from "react";
import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import type { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import type { EditUser } from "../types/userTypes";

// Creo el contexto para almacenar valores del usuario
export interface AuthContextProps {
  list: () => Promise<DataResponseFromAPI | ErrorResponse>;
  modifyUser: (user: EditUser) => Promise<EditUser | ErrorResponse>;
}

// Creo el contexto con los valores por defecto
export const AuthContext = createContext<AuthContextProps | null>(null);
