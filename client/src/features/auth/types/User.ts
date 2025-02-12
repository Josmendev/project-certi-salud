export interface IUser {
  userId: number | null;
  username?: string;
  password?: string;
  staffId?: number | null;
  token?: string;
  isConfirm?: boolean;
  isActive?: boolean;
  role?: Array<string>;
}
