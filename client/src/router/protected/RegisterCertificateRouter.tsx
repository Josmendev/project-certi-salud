import { Navigate, Route, Routes } from "react-router";
import { CertificateRoutes } from "../../features/register-certificates/certificate/routes/CertificateRoutes";
import { TypeCertificateRoutes } from "../../features/register-certificates/type-certificate/routes/TypeCertificateRoutes";
import { BASE_ROUTES, REGISTER_CERTIFICATE_ROUTES } from "../../shared/utils/constants";

export const RegisterCertificateRouter = () => {
  return (
    <Routes>
      <Route
        path={REGISTER_CERTIFICATE_ROUTES.TYPE_CERTIFICATES + "/*"}
        element={<TypeCertificateRoutes />}
      />
      <Route
        path={REGISTER_CERTIFICATE_ROUTES.CERTIFICATES + "/*"}
        element={<CertificateRoutes />}
      />
      {/* Ruta comodín para URLs no reconocidas */}
      <Route path="*" element={<Navigate to={"/" + BASE_ROUTES.PRIVATE.DASHBOARD} replace />} />
    </Routes>
  );
};
