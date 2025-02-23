import { ActivateRoleService } from "../services/ActivateRoleService";
import { CreateRoleService } from "../services/CreateRoleService";
import { DeleteRoleService } from "../services/DeleteRoleService";
import { ListRolesService } from "../services/ListRolesService";
import { SearchRolesService } from "../services/SearchRolesService";
import { UpdateRoleService } from "../services/UpdateRoleService";
import type { UpsertRole } from "../types/roleTypes";

//Funcion para agregar rol
export const createRole = async ({ role }: { role: UpsertRole }) => {
  const newRole = await CreateRoleService({ role });
  return newRole;
};

// Funcion para obtener todos los roles
export const getRoles = async ({ limit, page }: { limit?: number; page: number }) => {
  const roles = await ListRolesService({ limit, page });
  return roles;
};

// Funcion para actualizar un rol
export const updateRole = async ({ role, roleId }: { role: UpsertRole; roleId: number }) => {
  const updatedRole = await UpdateRoleService({ role, roleId });
  return updatedRole;
};

// Funcion para eliminar un rol
export const deleteRole = async ({ roleId }: { roleId: number }) => {
  await DeleteRoleService({ roleId });
};

// Funcion para buscar roles
export const searchRoles = async ({
  limit,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) => {
  const roles = await SearchRolesService({ limit, page, query });
  return roles;
};

// Funcion para activar un rol
export const activateRole = async ({ roleId }: { roleId: number }) => {
  console.log(roleId);
  await ActivateRoleService({ roleId });
};
