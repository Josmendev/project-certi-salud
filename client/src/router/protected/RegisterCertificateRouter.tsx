import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { CertificateRoutes } from "../../features/register-certificates/certificate/routes/CertificateRoutes";
import { TypeCertificateRoutes } from "../../features/register-certificates/type-certificate/routes/TypeCertificateRoutes";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { getRolesOfUser } from "../../shared/helpers/getRolesForDescription";
import { BASE_ROUTES, REGISTER_CERTIFICATE_ROUTES } from "../../shared/utils/constants";

export const RegisterCertificateRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Esta ruta solo aplica para admin. */}
      {getRolesOfUser(user)?.includes("Administrador") && (
        <Route
          path={REGISTER_CERTIFICATE_ROUTES.TYPE_CERTIFICATES + "/*"}
          element={<TypeCertificateRoutes />}
        />
      )}

      <Route
        path={REGISTER_CERTIFICATE_ROUTES.CERTIFICATES + "/*"}
        element={<CertificateRoutes />}
      />
      {/* Ruta comodín para URLs no reconocidas */}
      <Route path="*" element={<Navigate to={"/" + BASE_ROUTES.PRIVATE.DASHBOARD} replace />} />
    </Routes>
  );
};
