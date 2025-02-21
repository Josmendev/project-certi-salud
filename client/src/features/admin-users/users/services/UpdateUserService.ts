import { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import { handleError } from "../../../../shared/utils/handleError";
import { type DataOfUser, type EditUser } from "../types/userTypes";
import { ENDPOINTS_USER } from "../utils/endpoints";

// Creo la funcion login que se conecta a la API del backend
export const UpdateUserService = async (user: EditUser): Promise<DataOfUser | ErrorResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const { userId, ...userData } = user;

    const response = await fetch(`${ENDPOINTS_USER.LIST_OF_USERS}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    // Respuesta no exitosa, lanzo excepcion con (message, status, details)
    if (!response.ok) {
      const errorResponse = await response.json();
      return handleError(errorResponse);
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: DataOfUser = await response.json();
    return data;
  } catch (error: unknown) {
    return handleError(error);
  }
};
