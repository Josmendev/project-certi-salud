import { z } from "zod";

export const CertificateTypeSchema = z
  .string()
  .nonempty("El tipo de certificado no puede ser un campo vacío")
  .min(4, "El tipo de certificado debe tener al menos 4 caracteres")
  .max(20, "El tipo de certificado debe tener como máximo 20 caracteres");

export const getCertificateTypeSchema = () => z.object({ description: CertificateTypeSchema });
