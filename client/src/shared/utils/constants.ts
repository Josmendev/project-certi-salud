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

// Asiginacion del router en los modulos
export const ADMIN_USERS_ROUTES = {
  USERS: "users",
  ROLES: "roles",
  STAFF: "staff",
};

export const INFO_REQUIRED_ROUTES = {
  PATIENTS: "patients",
  DISEASES: "diseases",
};

export const REGISTER_CERTIFICATE_ROUTES = {
  CERTIFICATES: "certificates",
  TYPE_CERTIFICATES: "type-certificates",
};

export const REPORT_CERTIFICATE_ROUTES = {
  REPORT: "reports-certificates",
};

// Defino un mapa de roles
export const ROLES_MAPPING: Record<string, number> = { Administrador: 1, Registrador: 2 } as const;

// Defino un tipo con las claves (Administrador, Registrador) y tipo con valores con 1 y 2
export type ROLES_KEYS = keyof typeof ROLES_MAPPING;
export type ROLES_VALUES = (typeof ROLES_MAPPING)[ROLES_KEYS];

export const INITIAL_PAGE = 1;
export const LIMIT_PAGE = 5;

// Defino el estado inicial para todos los listados de tablas
export const initialListOfResponseAPI = {
  data: [],
  limit: 5,
  page: 1,
  total: 1,
  totalPages: 1,
};
