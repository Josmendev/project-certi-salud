import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { CertificateTypeListPage } from "../pages/CertificateTypeListPage";

export const TypeCertificateRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<CertificateTypeListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<CertificateTypeListPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
