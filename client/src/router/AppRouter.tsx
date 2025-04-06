import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ConfirmUserPage } from "../features/auth/pages/ConfirmUserPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ReportRoutes } from "../features/reports/certificates/routes/ReportRoutes";
import { AuthContext } from "../shared/contexts/AuthContext";
import { getRolesOfUser } from "../shared/helpers/getRolesForDescription";
import { DashBoardPage } from "../shared/pages/DashBoardPage";
import { BASE_ROUTES } from "../shared/utils/constants";
import { AdminRouter } from "./protected/AdminRouter";
import { InfoRequiredRouter } from "./protected/InfoRequiredRouter";
import { PrivateRoute } from "./protected/PrivateRoute";
import { RegisterCertificateRouter } from "./protected/RegisterCertificateRouter";
import { PublicRoute } from "./PublicRoute";

export const AppRouter = () => {
  const { PRIVATE, PUBLIC } = BASE_ROUTES;
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path={PUBLIC.HOME} element={<PublicRoute />}>
        <Route index element={<LoginPage />} />
        <Route path={PUBLIC.LOGIN} element={<LoginPage />} />
        <Route path={PUBLIC.CONFIRM_ACCOUNT} element={<ConfirmUserPage />} />
        {/* Ruta comodín para URLs no reconocidas */}
        <Route path="*" element={<Navigate to={"/" + PUBLIC.LOGIN} replace />} />
      </Route>

      {/* Rutas privadas */}
      <Route path="/*" element={<PrivateRoute />}>
        <Route path={PRIVATE.DASHBOARD} element={<DashBoardPage />} />
        <Route path={PRIVATE.REGISTER_CERTIFICATE + "/*"} element={<RegisterCertificateRouter />} />
        <Route path={PRIVATE.REPORTS + "/*"} element={<ReportRoutes />} />

        {/* Solo el admin puede acceder a estas rutas */}
        {getRolesOfUser(user)?.includes("Administrador") && (
          <>
            <Route path={PRIVATE.ADMIN + "/*"} element={<AdminRouter />} />
            <Route path={PRIVATE.INFO_REQUIRED + "/*"} element={<InfoRequiredRouter />} />
          </>
        )}

        {/* Ruta comodín para URLs no reconocidas */}
        <Route path="*" element={<Navigate to={"/" + PRIVATE.DASHBOARD} replace />} />
      </Route>
    </Routes>
  );
};
