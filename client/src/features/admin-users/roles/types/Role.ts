export interface Role {
  roleId: number;
  description: string;
  isActive?: boolean;
}

export interface UserHasRoles {
  userId: number;
  roleId: number;
}

export type UpsertRole = Pick<Role, "description">;

export type UpdateRoleSelected = {
  selectedRole: Role | null;
  clearSelectedRole: () => void;
};

export type RoleResponse = Role;
