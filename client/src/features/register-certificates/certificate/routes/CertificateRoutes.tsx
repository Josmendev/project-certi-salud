import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { CertificateCreatePage } from "../pages/CertificateCreatePage";

export const CertificateRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<CertificateCreatePage />} />
        <Route path={CRUD_ROUTES.ADD} element={<CertificateCreatePage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
