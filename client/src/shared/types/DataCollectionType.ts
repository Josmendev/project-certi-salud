import type { RoleResponse } from "../../features/admin-users/roles/types/Role";
import type { StaffResponse } from "../../features/admin-users/staff/types/Staff";
import type { User } from "../../features/auth/types/User";

// Creo todos los tipos de datos a asignar en tablas
export type DataCollectionType = User | RoleResponse | StaffResponse;
