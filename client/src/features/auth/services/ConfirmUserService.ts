import { ErrorResponse } from "../../../shared/types/ErrorResponse";
import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleError } from "../../../shared/utils/handleError";
import { type AuthConfirmUser, type AuthResponseUser } from "../types/authTypes";

// Creo la funcion confirmUser que se conecta a la API del backend
export const ConfirmUserService = async (
  user: AuthConfirmUser,
  userId: number
): Promise<AuthResponseUser | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.CONFIRM_ACCOUNT}/${userId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Si la respuesta no es exitosa, lanzo la excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Si la respuesta es exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: AuthResponseUser = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
