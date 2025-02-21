import { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import { handleError } from "../../../../shared/utils/handleError";
import { type EditUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";

// Creo la funcion login que se conecta a la API del backend
export const ResetPasswordUserService = async (user: EditUser): Promise<void | ErrorResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINTS_USER.RESET_PASSWORD}/${user.userId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }
  } catch (error: unknown) {
    return handleError(error);
  }
};
