import { ResponseDataUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";
import { ErrorResponse } from "./../../../../shared/types/ErrorResponse";
import { handleError } from "./../../../../shared/utils/handleError";

// Creo la funcion login que se conecta a la API del backend
export const ListOfUsersService = async (): Promise<ResponseDataUser | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_USER.LIST_OF_USERS}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    // Respuesta no exitosa, lanzo excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: ResponseDataUser = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
