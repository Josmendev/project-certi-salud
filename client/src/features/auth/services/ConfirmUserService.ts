import { ENDPOINTS_AUTH } from "../../../shared/utils/endpoints";
import { handleApiError } from "../../../shared/utils/handleApiError";
import { type AuthConfirmUser, type AuthResponseUser } from "../types/authTypes";

// Creo la funcion confirmUser que se conecta a la API del backend
export const ConfirmUserService = async (
  user: AuthConfirmUser,
  userId: number
): Promise<AuthResponseUser> => {
  try {
    const response = await fetch(`${ENDPOINTS_AUTH.CONFIRM_ACCOUNT}/${userId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto AuthResponseUser
    const data: AuthResponseUser = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error); // Similar al throw, pero enfocado a promesas
  }
};
