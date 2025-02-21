import { useReducer, useState } from "react";
import type { DataOfUser } from "../../features/admin-users/users/types/userTypes";
import { ConfirmUserService } from "../../features/auth/services/ConfirmUserService";
import { LoginService } from "../../features/auth/services/LoginService";
import { LogoutService } from "../../features/auth/services/LogoutService";
import { ProfileUserService } from "../../features/auth/services/ProfileUserService";
import type {
  AuthConfirmUser,
  AuthLoginUser,
  AuthResponseUser,
} from "../../features/auth/types/authTypes";
import { AuthContext } from "../contexts/AuthContext";
import { showToast } from "../hooks/useToast";
import useTokenExpiration from "../hooks/useTokenExpiration";
import { authReducer } from "../reducer/authReducer";
import { initialStateAuthUser } from "../reducer/authStates";
import { AUTH_TYPES } from "../reducer/authTypes";
import type { ErrorResponse } from "../types/ErrorResponse";

interface AuthProviderProps {
  children: React.ReactNode;
}

const init = () => {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const parsedUser = userFromSessionStorage ? JSON.parse(userFromSessionStorage) : {};
  if (parsedUser.token) {
    parsedUser.isActive = true;
    parsedUser.isConfirm = true;
  }

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
    try {
      setLoading(true);
      const responseUser = await LoginService(credentials);

      if ("statusCode" in responseUser && responseUser.statusCode >= 400) return responseUser;

      const { token } = responseUser as AuthResponseUser;
      dispatch({ type: AUTH_TYPES.login, payload: { ...responseUser, token } });
      sessionStorage.setItem("user", JSON.stringify(responseUser));

      await profileUser(token);
      return responseUser;
    } finally {
      setLoading(false);
    }
  };

  const confirmUser = async (
    credentials: AuthConfirmUser
  ): Promise<AuthResponseUser | ErrorResponse> => {
    try {
      setLoading(true);
      const { userId } = authStateUser;
      if (!userId) throw new Error("User ID is missing");

      const responseUser = await ConfirmUserService(credentials, userId);

      if ("statusCode" in responseUser && responseUser.statusCode >= 400) return responseUser;

      const { token } = responseUser as AuthResponseUser;
      const responsePrevUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const responseUserUpdated = { ...responsePrevUser, ...responseUser, token };

      sessionStorage.setItem("user", JSON.stringify(responseUserUpdated));
      dispatch({ type: AUTH_TYPES.confirmUser, payload: responseUser });

      await profileUser(responseUserUpdated?.token);
      return responseUser;
    } finally {
      setLoading(false);
    }
  };

  const profileUser = async (token: string): Promise<AuthResponseUser | ErrorResponse> => {
    try {
      setLoading(true);

      const responseUser = await ProfileUserService(token);

      if ("statusCode" in responseUser && responseUser.statusCode >= 400) return responseUser;

      const responsePrevUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const responseUserUpdated = { ...responsePrevUser, ...responseUser };

      sessionStorage.setItem("user", JSON.stringify(responseUserUpdated));
      dispatch({ type: AUTH_TYPES.profile, payload: responseUser });
      return responseUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      if (!authStateUser?.token) throw new Error("Token is missing");
      await LogoutService(authStateUser?.token);

      sessionStorage.removeItem("user");
      dispatch({ type: AUTH_TYPES.logout });
    } finally {
      setLoading(false);
    }
  };

  const updateUserInSession = (updatedUser: DataOfUser) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

    // Solo actualizar si el usuario en sesión, es el mismo que se edita
    if (storedUser?.userId === updatedUser.userId) {
      const updatedSessionUser = { ...storedUser, ...updatedUser };
      sessionStorage.setItem("user", JSON.stringify(updatedSessionUser));
      dispatch({ type: AUTH_TYPES.profile, payload: updatedSessionUser });
    }
  };

  //Verifico la expiración del token
  useTokenExpiration(authStateUser?.token, async () => {
    if (authStateUser?.token) {
      await logout();
      showToast({
        title: "Sesión cerrada",
        description: "Su token de sesión ha expirado. Favor vuelve a iniciar sesión",
        type: "success",
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user: authStateUser,
        loading,
        login,
        logout,
        profileUser,
        confirmUser,
        updateUserInSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
