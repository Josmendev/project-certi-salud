import { BASE_BACKEND_URL } from "./constants";

export const ENDPOINTS_AUTH = {
  LOGIN: `${BASE_BACKEND_URL}/auth/login`,
  PROFILE: `${BASE_BACKEND_URL}/auth/user-profile`,
  LOGOUT: `${BASE_BACKEND_URL}/auth/logout`,
  CONFIRM_ACCOUNT: `${BASE_BACKEND_URL}/auth/confirm-account`,
} as const;
