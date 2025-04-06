import { z } from "zod";
import {
  AgeSchema,
  DNISchema,
  FullNameSchema,
  LastNameSchema,
} from "../../../../shared/schemas/commonSchemas";

export const getCertificateSchema = () =>
  z.object({
    identityDocumentNumber: DNISchema,
    name: FullNameSchema,
    paternalSurname: LastNameSchema("apellido paterno"),
    maternalSurname: LastNameSchema("apellido materno"),
    age: AgeSchema,
    // Adicionales
    issueDate: z.string(),
    restDays: z
      .number({
        required_error: "Días de descanso es un campo requerido",
        invalid_type_error: "Días de descanso debe ser un campo numérico",
      })
      .min(1, "Debe ser al menos 1 día de descanso")
      .nullish(),
    diseases: z.array(z.object({ diseaseId: z.number() })),
  });
