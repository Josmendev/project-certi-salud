import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { type EditUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";
import { ErrorResponse } from "./../../../../shared/types/ErrorResponse";
import { handleError } from "./../../../../shared/utils/handleError";

// Creo la funcion login que se conecta a la API del backend
export const EditUserService = async (
  user: EditUser
): Promise<DataResponseFromAPI | ErrorResponse> => {
  try {
    const response = await fetch(`${ENDPOINTS_USER.LIST_OF_USERS}/${user.userId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Respuesta no exitosa, lanzo excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: DataResponseFromAPI = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
