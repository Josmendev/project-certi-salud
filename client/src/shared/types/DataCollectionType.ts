import type { RoleResponse } from "../../features/admin-users/roles/types/Role";
import type { StaffResponse } from "../../features/admin-users/staff/types/Staff";
import type { User } from "../../features/auth/types/User";
import type { DiseaseResponse } from "../../features/info-required/disease/types/Disease";
import type { PatientResponse } from "../../features/info-required/patient/types/Patient";
import type { CertificateTypeResponse } from "../../features/register-certificates/type-certificate/types/CertificateType";

// Creo todos los tipos de datos a asignar en tablas
export type DataCollectionType =
  | User
  | RoleResponse
  | StaffResponse
  | PatientResponse
  | DiseaseResponse
  | CertificateTypeResponse;
