import { Navigate, Route, Routes } from "react-router";
import {
  BASE_ROUTES,
  CRUD_ROUTES,
  REGISTER_CERTIFICATE_ROUTES,
} from "../../../../shared/utils/constants";
import { CertificateCreatePage } from "../pages/CertificateCreatePage";

export const CertificateRoutes: React.FC = () => {
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.REGISTER_CERTIFICATE}/${REGISTER_CERTIFICATE_ROUTES.CERTIFICATES}`;

  return (
    <>
      <Routes>
        <Route index element={<CertificateCreatePage />} />
        <Route path={CRUD_ROUTES.ADD} element={<CertificateCreatePage />} />
        <Route path="*" element={<Navigate to={ROUTE_INITIAL} replace />} />
      </Routes>
    </>
  );
};
