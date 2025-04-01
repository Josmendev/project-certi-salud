import { handleApiError } from "../../../../shared/utils/handleApiError";
import { ENDPOINT_CERTIFICATE } from "../utils/endpoints";

// Creo la funcion GenerateCodeCertificateService que se conecta a la API del backend
export const GenerateCodeCertificateService = async (): Promise<string> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_CERTIFICATE}/certificate-code`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto CertificateResponse
    const data: string = await response.text();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
