import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { PatientCreatePage } from "../pages/PatientCreatePage";
import { PatientDetailPage } from "../pages/PatientDetailPage";
import { PatientEditPage } from "../pages/PatientEditPage";
import { PatientListPage } from "../pages/PatientListPage";

export const PatientRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<PatientCreatePage />} />
        <Route path={CRUD_ROUTES.DETAIL} element={<PatientDetailPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<PatientEditPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
