import { ErrorResponse } from "../../../shared/types/ErrorResponse";
import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleError } from "../../../shared/utils/handleError";
import { type AuthLogoutUser, type AuthResponseUser } from "../types/authTypes";

// Creo la funcion logout que se conecta a la API del backend
export const LogoutService = async (
  user: AuthLogoutUser
): Promise<AuthResponseUser | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${user?.token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: AuthResponseUser = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
