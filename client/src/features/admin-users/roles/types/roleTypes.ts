import type { Role } from "./Role";

// Defino los tipos de INPUT para Role
export type UpsertRole = Pick<Role, "description">;

export type UpdateSelectedRole = {
  selectedRole: Role | null;
  clearSelectedRole: () => void;
};

// Defino el tipo de OUTPUT para Role
export type ResponseRole = Role;
