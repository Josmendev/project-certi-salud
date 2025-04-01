import type { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import { CreateCertificateService } from "../../../register-certificates/certificate/services/CreateCertificateService";
import { SearchPersonForDniService } from "../../../register-certificates/certificate/services/SearchPersonByIdService";
import {
  Certificate,
  type PersonByDniResponse,
} from "../../../register-certificates/certificate/types/Certificate";
import { GenerateCodeCertificateService } from "../services/GenerateCodeCertificateService";
import { ListExternalCertificateTypeService } from "../services/ListCertificateTypeService";
import { ListExternalDiseaseService } from "../services/ListExternalDiseaseService";
import { SearchExternalDiseasesService } from "../services/SearchExternalDiseaseService";

//Funcion para agregar certificate
export const createCertificate = async ({ certificate }: { certificate: Certificate }) => {
  const newCertificate = await CreateCertificateService({ certificate });
  return newCertificate;
};

// Funcion para obtener los tipos de certificados
export const getTypeCertificateOptions = async () => {
  const allCertificates = await ListExternalCertificateTypeService();
  return allCertificates;
};

// Funcion para obtener los diseases en certificados
export const getAllDiseasesInCertificate = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query
    ? SearchExternalDiseasesService({ limit, page, query })
    : ListExternalDiseaseService({ limit, page });
};
// Funcion para generar code por certificate
export const generateCodeCertificate = async () => {
  const codeInCertificate = await GenerateCodeCertificateService();
  return codeInCertificate;
};

// Funcion para buscar por dni una persona
export const getPersonByDni = async ({
  dni,
}: {
  dni: string;
}): Promise<PersonByDniResponse | ErrorResponse> => {
  const response = await SearchPersonForDniService({ dni });
  if ("message" in response) return response as ErrorResponse;
  return response;
};
