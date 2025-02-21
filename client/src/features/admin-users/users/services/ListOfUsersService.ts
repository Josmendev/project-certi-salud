import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { INITIAL_PAGE, LIMIT_PAGE } from "../../../../shared/utils/constants";
import { parseErrorResponse } from "../../../../shared/utils/parseErrorResponse";
import type { DataOfUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";

// Creo la funcion listOfUsers que se conecta a la API del backend
export const ListOfUsersService = async ({
  limit = LIMIT_PAGE,
  page = INITIAL_PAGE,
}: {
  limit?: number;
  page: number;
}): Promise<DataResponseFromAPI<DataOfUser>> => {
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

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto DataResponseFromAPI<DataOfUser>
    const data: DataResponseFromAPI<DataOfUser> = await response.json();
    return data;
  } catch (error: unknown) {
    throw parseErrorResponse(error);
  }
};
