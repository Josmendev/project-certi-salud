import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleApiError } from "../../../shared/utils/handleApiError";
import { type TokenLogoutUser } from "../types/authTypes";

// Creo la funcion logout que se conecta a la API del backend
export const LogoutService = async (token: TokenLogoutUser): Promise<void> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error); // Similar al throw, pero enfocado a promesas
  }
};
