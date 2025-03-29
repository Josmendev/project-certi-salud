import type { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { PersonByDniResponse } from "../types/Certificate";
import { ENDPOINT_CERTYFICATE } from "../utils/endpoints";

// Creo la funcion searchForPersonForDni que se conecta a la API del backend
export const SearchPersonForDniService = async ({
  dni,
}: {
  dni: string;
}): Promise<PersonByDniResponse | ErrorResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_CERTYFICATE}/person/dni`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ dni }),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto PersonByDniResponse
    const data = await response.json();
    if ("message" in data) return data as ErrorResponse;
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
