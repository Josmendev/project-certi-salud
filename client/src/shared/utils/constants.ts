export const BASE_BACKEND_URL = "http://localhost:3002/api/v1";

export const BASE_ROUTES = {
  PUBLIC: {
    LOGIN: "/login",
    CONFIRM_ACCOUNT: "confirm-account",
    HOME: "/",
  },
  PRIVATE: {
    DASHBOARD: "dashboard",
    ADMIN: "admin",
    INFO_REQUIRED: "info-required",
    REGISTER_CERTIFICATE: "register-certificate",
    REPORTS: "reports",
  },
};

export const CRUD_ROUTES = {
  LIST: "list",
  ADD: "add",
  DETAIL: ":id",
  EDIT: ":id/edit",
};

export const LIMIT_PAGE = 8;
export const INITIAL_PAGE = 1;
