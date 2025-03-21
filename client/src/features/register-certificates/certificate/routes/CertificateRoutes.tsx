import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { CertificateListPage } from "../pages/CertificateListPage";

export const CertificateRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<CertificateListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<CertificateListPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
