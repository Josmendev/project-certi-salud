import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import type { DataOfUsers } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";
import { ErrorResponse } from "./../../../../shared/types/ErrorResponse";
import { handleError } from "./../../../../shared/utils/handleError";

// Creo la funcion login que se conecta a la API del backend
export const ListOfUsersService = async (
  limit: number,
  page: number
): Promise<DataResponseFromAPI<DataOfUsers> | ErrorResponse> => {
  try {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (!user) throw new Error("Usuario no autenticado");

    const { token } = user;
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
    const data: DataResponseFromAPI<DataOfUsers> = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
