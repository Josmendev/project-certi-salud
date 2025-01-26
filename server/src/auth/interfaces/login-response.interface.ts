export interface LoginResponse {
  userId: number;
  username: string;
  isConfirm: boolean;
  token: string | null;
}