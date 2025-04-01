import { handleApiError } from "../../../../shared/utils/handleApiError";
import { ENDPOINT_REPORTS } from "../utils/endpoints";

// Creo la funcion GenerateAllReportsOfCertificate que se conecta a la API del backend
export const GenerateReportByIdInCertificateService = async ({
  reportId,
}: {
  reportId: string;
}): Promise<Blob> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_REPORTS}/generate-report-one/${reportId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/pdf",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw new Error("Error al generar el reporte");

    // Convertir la respuesta en un Blob
    const blobInPdf = await response.blob();
    return blobInPdf;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
