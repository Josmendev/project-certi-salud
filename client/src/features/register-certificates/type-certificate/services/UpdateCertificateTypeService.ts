import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { CertificateType, CertificateTypeResponse } from "../types/CertificateType";
import { ENDPOINT_CERTYFICATE_TYPE } from "../utils/endpoints";

// Creo la funcion updateCertificateType que se conecta a la API del backend
export const UpdateCertificateTypeService = async ({
  certificateType,
  certificateTypeId,
}: {
  certificateType: CertificateType;
  certificateTypeId: number;
}): Promise<CertificateTypeResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_CERTYFICATE_TYPE}/${certificateTypeId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(certificateType),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto DataResponseFromAPI<CertificateTypeResponse>
    const data: CertificateTypeResponse = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
