import { Navigate, Route, Routes } from "react-router";
import { ReportRoutes } from "../features/admin-reports/report-certificate/routes/ReportRoutes";
import { AdminRouter } from "../features/admin-users/router/AdminRouter";
import { ConfirmUserPage } from "../features/auth/pages/ConfirmUserPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { InfoRequiredRouter } from "../features/info-required/router/InfoRequiredRouter";
import { RegisterCertificateRouter } from "../features/register-certificates/router/RegisterCertificateRouter";
import { DashBoardPage } from "../shared/pages/DashBoardPage";
import { BASE_ROUTES } from "../shared/utils/constants";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export const AppRouter = () => {
  const { PRIVATE, PUBLIC } = BASE_ROUTES;

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
        <Route path={PRIVATE.ADMIN + "/*"} element={<AdminRouter />} />
        <Route path={PRIVATE.INFO_REQUIRED + "/*"} element={<InfoRequiredRouter />} />
        <Route path={PRIVATE.REGISTER_CERTIFICATE + "/*"} element={<RegisterCertificateRouter />} />
        <Route path={PRIVATE.REPORTS + "/*"} element={<ReportRoutes />} />

        {/* Ruta comodín para URLs no reconocidas */}
        <Route path="*" element={<Navigate to={"/" + PRIVATE.DASHBOARD} replace />} />
      </Route>
    </Routes>
  );
};
