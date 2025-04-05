import { Navigate, Route, Routes } from "react-router";
import { BASE_ROUTES, CRUD_ROUTES, INFO_REQUIRED_ROUTES } from "../../../../shared/utils/constants";
import { PatientListPage } from "../pages/PatientListPage";
import { PatientUpsertPage } from "../pages/PatientUpsertPage";

export const PatientRoutes: React.FC = () => {
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.INFO_REQUIRED}/${INFO_REQUIRED_ROUTES.PATIENTS}`;

  return (
    <>
      <Routes>
        <Route index element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<PatientListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<PatientUpsertPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<PatientUpsertPage />} />
        <Route path="*" element={<Navigate to={ROUTE_INITIAL} replace />} />
      </Routes>
    </>
  );
};
