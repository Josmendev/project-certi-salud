import { ActivateCertificateTypeService } from "../services/ActivateCertificateTypeService";
import { CreateCertificateTypeService } from "../services/CreateCertificateTypeService";
import { DeleteCertificateTypeService } from "../services/DeleteCertificateTypeService";
import { ListCertificateTypeService } from "../services/ListCertificateTypesService";
import { SearchCertificateTypeService } from "../services/SearchCertificateTypeService";
import { UpdateCertificateTypeService } from "../services/UpdateCertificateTypeService";
import type { CertificateType } from "../types/CertificateType";

//Funcion para agregar certificateType
export const createCertificateType = async ({
  certificateType,
}: {
  certificateType: CertificateType;
}) => {
  const newCertificateType = await CreateCertificateTypeService({ certificateType });
  return newCertificateType;
};

// Funcion para obtener y buscar todos los certificateTypes
export const getCertificateTypes = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query
    ? SearchCertificateTypeService({ limit, page, query })
    : ListCertificateTypeService({ limit, page });
};

// Funcion para actualizar un certificateType
export const updateCertificateType = async ({
  certificateType,
  certificateTypeId,
}: {
  certificateType: CertificateType;
  certificateTypeId: number;
}) => {
  const updatedCertificateType = await UpdateCertificateTypeService({
    certificateType,
    certificateTypeId,
  });
  return updatedCertificateType;
};

// Funcion para eliminar un certificateType
export const deleteCertificateType = async ({
  certificateTypeId,
}: {
  certificateTypeId: number;
}) => {
  await DeleteCertificateTypeService({ certificateTypeId });
};

// Funcion para activar un certificateType
export const activateCertificateType = async ({
  certificateTypeId,
}: {
  certificateTypeId: number;
}) => {
  await ActivateCertificateTypeService({ certificateTypeId });
};
