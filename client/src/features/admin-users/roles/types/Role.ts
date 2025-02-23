export interface Role {
  roleId: number;
  description: string;
  isActive?: boolean;
}

export interface UserHasRoles {
  userId: number;
  roleId: number;
}
