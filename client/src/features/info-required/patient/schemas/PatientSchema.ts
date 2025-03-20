import { z } from "zod";
import {
  AgeSchema,
  DNISchema,
  FullNameSchema,
  LastNameSchema,
} from "../../../../shared/schemas/commonSchemas";

export const getPatientSchema = () =>
  z.object({
    identityDocumentNumber: DNISchema,
    name: FullNameSchema,
    paternalSurname: LastNameSchema("apellido paterno"),
    maternalSurname: LastNameSchema("apellido materno"),
    age: AgeSchema,
  });
