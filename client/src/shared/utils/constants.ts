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

// Defino un mapa de roles
export const ROLES_MAPPING: Record<string, number> = { Administrador: 1, Registrador: 2 } as const;

// Defino un tipo con las claves (Administrador, Registrador)
export type ROLES_KEYS = keyof typeof ROLES_MAPPING;

// Defino un tipo con los valores (1, 2)
export type ROLES_VALUES = (typeof ROLES_MAPPING)[ROLES_KEYS];

export const INITIAL_PAGE = 1;
export const LIMIT_PAGE = 5;
