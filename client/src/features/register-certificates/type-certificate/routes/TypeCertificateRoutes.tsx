import { Navigate, Route, Routes } from "react-router";
import {
  BASE_ROUTES,
  CRUD_ROUTES,
  REGISTER_CERTIFICATE_ROUTES,
} from "../../../../shared/utils/constants";
import { CertificateTypeListPage } from "../pages/CertificateTypeListPage";

export const TypeCertificateRoutes: React.FC = () => {
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.REGISTER_CERTIFICATE}/${REGISTER_CERTIFICATE_ROUTES.TYPE_CERTIFICATES}`;

  return (
    <>
      <Routes>
        <Route index element={<CertificateTypeListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<CertificateTypeListPage />} />
        <Route path="*" element={<Navigate to={ROUTE_INITIAL} replace />} />
      </Routes>
    </>
  );
};
