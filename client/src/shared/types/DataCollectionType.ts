import type { RoleResponse } from "../../features/admin-users/roles/types/Role";
import type { DataOfUser } from "../../features/admin-users/users/types/userTypes";

// Creo todos los tipos de datos a asignar en tablas
export type DataCollectionType = DataOfUser | RoleResponse;
