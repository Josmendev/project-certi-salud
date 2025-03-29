import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { Certificate, CertificateResponse } from "../types/Certificate";
import { ENDPOINT_CERTYFICATE } from "../utils/endpoints";

// Creo la funcion createCertificate que se conecta a la API del backend
export const CreateCertificateService = async ({
  certificate,
}: {
  certificate: Certificate;
}): Promise<CertificateResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_CERTYFICATE}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(certificate),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto CertificateResponse
    const data: CertificateResponse = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
