import { useReducer, useState } from "react";
import { ConfirmUserService } from "../../features/auth/services/ConfirmUserService";
import { LoginService } from "../../features/auth/services/LoginService";
import type {
  AuthConfirmUser,
  AuthLoginUser,
  AuthResponseUser,
} from "../../features/auth/types/authTypes";
import { AuthContext } from "../contexts/AuthContext";
import { authReducer } from "../reducer/authReducer";
import { initialStateAuthUser } from "../reducer/authStates";
import { AUTH_TYPES } from "../reducer/authTypes";
import type { ErrorResponse } from "../types/ErrorResponse";

interface AuthProviderProps {
  children: React.ReactNode;
}

const init = () => {
  const userFromLocalStorage = localStorage.getItem("user");
  const parsedUser = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : {};
  if (parsedUser.token) parsedUser.isActive = true;

  return {
    ...initialStateAuthUser,
    ...parsedUser,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authStateUser, dispatch] = useReducer(authReducer, initialStateAuthUser, init);
  const [loading, setLoading] = useState(false);

  // Gestiono el estado con el reducer (Consumo del servicio)
  const login = async (credentials: AuthLoginUser): Promise<AuthResponseUser | ErrorResponse> => {
    setLoading(true);
    const userData = await LoginService(credentials);
    // Respuesta no exitosa: Si userData es null o ErrorResponse, no actualizo el estado
    if (!userData || ("statusCode" in userData && userData.statusCode >= 400)) {
      setLoading(false);
      return userData;
    }

    // Respuesta exitosa
    const action = {
      type: AUTH_TYPES.login,
      payload: userData,
    } as const;

    localStorage.setItem("user", JSON.stringify(userData));
    dispatch(action);
    setLoading(false);
    return userData;
  };

  const confirmUser = async (
    credentials: AuthConfirmUser
  ): Promise<AuthResponseUser | ErrorResponse> => {
    setLoading(true);
    const { userId } = authStateUser;
    // Envio las credenciales y en la URL coloco el ID
    const userData = await ConfirmUserService(credentials, userId as number);

    // Respuesta no exitosa: Si userData es null o ErrorResponse, no actualizo el estado
    if (!userData || ("statusCode" in userData && userData.statusCode >= 400)) {
      setLoading(false);
      return userData;
    }

    // Respuesta exitosa
    const action = {
      type: AUTH_TYPES.confirmUser,
      payload: userData,
    } as const;

    const userPrevData = JSON.parse(localStorage.getItem("user") as string);
    const userDataUpdated = {
      ...userPrevData,
      ...userData,
    };

    localStorage.setItem("user", JSON.stringify(userDataUpdated));
    dispatch(action);
    setLoading(false);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: AUTH_TYPES.logout } as const);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authStateUser,
        loading,
        login,
        logout,
        confirmUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
