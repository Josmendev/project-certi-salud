import { ErrorResponse } from "../../../shared/types/ErrorResponse";
import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleError } from "../../../shared/utils/handleError";
import type { AuthResponseUser } from "../types/authTypes";

// Creo la funcion profileUser que se conecta a la API del backend
export const ProfileUserService = async (
  token: string
): Promise<AuthResponseUser | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.PROFILE}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Si la respuesta no es exitosa, lanzo la excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Si la respuesta es exitosa, parseo el JSON y devuelvo el objeto IUser
    const data: AuthResponseUser = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
