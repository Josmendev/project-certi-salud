import { DeleteCertificateService } from "../services/DeleteCertificateService";
import { GenerateAllReportsOfCertificateService } from "../services/GenerateAllReportsOfCertificateService";
import { GenerateReportByIdInCertificateService } from "../services/GenerateReportByIdInCertificateService";
import { ListCertificatesService } from "../services/ListCertificatesService";
import { SearchCertificateService } from "../services/SearchCertificateService";

// Funcion para obtener los diseases en certificados
export const getAllCertificatesInReports = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query
    ? SearchCertificateService({ limit, page, query })
    : ListCertificatesService({ limit, page });
};

// Funcion para imprimir todos los reportes
export const getAllReportsInCertificate = async (): Promise<string> => {
  const pdfBlob = await GenerateAllReportsOfCertificateService();
  return window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
};

// Funcion para imprimir reporte por ID
export const getReportByIdInCertificate = async ({
  reportId,
}: {
  reportId: string;
}): Promise<string> => {
  const pdfBlob = await GenerateReportByIdInCertificateService({ reportId });
  return window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
};

// Funcion para eliminar un certificado
export const deleteCertificate = async ({ certificateId }: { certificateId: string }) => {
  await DeleteCertificateService({ certificateId });
};
