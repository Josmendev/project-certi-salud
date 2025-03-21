import { Navigate, Route, Routes } from "react-router";
import { BASE_ROUTES } from "../../../shared/utils/constants";
import { CertificateRoutes } from "../certificate/routes/CertificateRoutes";
import { TypeCertificateRoutes } from "../type-certificate/routes/TypeCertificateRoutes";
import { REGISTER_CERTIFICATE_ROUTES } from "../utils/constants";
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
