import { BASE_BACKEND_URL } from "../../../../shared/utils/constants";

export const ENDPOINTS_USER = {
  LIST_OF_USERS: `${BASE_BACKEND_URL}/admin/users/`,
  EDIT_USER: `${BASE_BACKEND_URL}/admin/users/edit`,
} as const;
