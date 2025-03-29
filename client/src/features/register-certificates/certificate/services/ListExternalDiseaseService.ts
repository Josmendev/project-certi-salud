import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";
import { ENDPOINT_CERTYFICATE } from "../utils/endpoints";

// Creo la funcion listDiseases que se conecta a la API del backend
export const ListExternalDiseaseService = async ({
  limit = LIMIT_PAGE,
  page = 1,
}: {
  limit?: number;
  page: number;
}): Promise<DataResponseFromAPI<DiseaseResponse>> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_CERTYFICATE}/diseases?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto Array<DiseaseResponse>
    const data: DataResponseFromAPI<DiseaseResponse> = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
