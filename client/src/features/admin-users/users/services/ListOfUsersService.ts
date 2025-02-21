import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { INITIAL_PAGE, LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { DataOfUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";
import { ErrorResponse } from "./../../../../shared/types/ErrorResponse";
import { handleError } from "./../../../../shared/utils/handleError";

// Creo la funcion login que se conecta a la API del backend
export const ListOfUsersService = async (
  limit: number = LIMIT_PAGE,
  page: number = INITIAL_PAGE
): Promise<DataResponseFromAPI<DataOfUser> | ErrorResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINTS_USER.LIST_OF_USERS}?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: DataResponseFromAPI<DataOfUser> = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
