import { Role } from "../entities/role.entity";

export const formatRoleResponse =  (role: Role) => {
  const { createdAt, updatedAt, ...roleData } = role;
  return roleData;
}