import { ErrorResponse } from "../../../shared/types/ErrorResponse";
import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleError } from "../../../shared/utils/handleError";
import { type TokenLogoutUser } from "../types/authTypes";

// Creo la funcion logout que se conecta a la API del backend
export const LogoutService = async (token: TokenLogoutUser): Promise<void | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }
  } catch (error: unknown) {
    return handleError(error);
  }
};
