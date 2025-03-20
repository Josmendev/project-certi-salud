import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { PatientListPage } from "../pages/PatientListPage";
import { PatientUpsertPage } from "../pages/PatientUpsertPage";

export const PatientRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<PatientUpsertPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<PatientUpsertPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
