import { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { INITIAL_PAGE, LIMIT_PAGE } from "../../../../shared/utils/constants";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { DiseaseResponse } from "../types/Disease";
import { ENDPOINT_DISEASE } from "../utils/endpoints";

// Creo la funcion searchForDiseases que se conecta a la API del backend
export const SearchDiseasesService = async ({
  limit = LIMIT_PAGE,
  page = INITIAL_PAGE,
  query = "",
}: {
  limit?: number;
  page: number;
  query: string;
}): Promise<DataResponseFromAPI<DiseaseResponse>> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_DISEASE}/${query}?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto DataResponseFromAPI<DiseaseResponse>
    const data: DataResponseFromAPI<DiseaseResponse> = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
