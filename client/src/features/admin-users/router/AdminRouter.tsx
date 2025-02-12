import { Navigate, Route, Routes } from "react-router";
import { BASE_ROUTES } from "../../../shared/utils/constants";
import { RoleRoutes } from "../roles/routes/RolesRoutes";
import { StaffRoutes } from "../staff/routes/StaffRoutes";
import { UserRoutes } from "../users/routes/UserRoutes";
import { ADMIN_USERS_ROUTES } from "../utils/constants";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route path={ADMIN_USERS_ROUTES.USERS + "/*"} element={<UserRoutes />} />
      <Route path={ADMIN_USERS_ROUTES.ROLES + "/*"} element={<RoleRoutes />} />
      <Route path={ADMIN_USERS_ROUTES.STAFF + "/*"} element={<StaffRoutes />} />
      {/* Ruta comodín para URLs no reconocidas */}
      <Route path="*" element={<Navigate to={"/" + BASE_ROUTES.PRIVATE.DASHBOARD} replace />} />
    </Routes>
  );
};
