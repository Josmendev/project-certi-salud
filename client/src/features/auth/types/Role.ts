export interface IRole {
  role_id: number;
  description: string;
  isActive: boolean;
}

export interface UserHasRoles {
  user_id: number;
  role_id: number;
}
