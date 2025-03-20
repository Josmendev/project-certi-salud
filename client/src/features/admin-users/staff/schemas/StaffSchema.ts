import { z } from "zod";
import {
  DNISchema,
  FullNameSchema,
  LastNameSchema,
} from "../../../../shared/schemas/commonSchemas";

export const getStaffSchema = () =>
  z.object({
    identityDocumentNumber: DNISchema,
    name: FullNameSchema,
    paternalSurname: LastNameSchema("apellido paterno"),
    maternalSurname: LastNameSchema("apellido materno"),
  });
