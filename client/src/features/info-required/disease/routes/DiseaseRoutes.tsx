import { Navigate, Route, Routes } from "react-router";
import { BASE_ROUTES, CRUD_ROUTES, INFO_REQUIRED_ROUTES } from "../../../../shared/utils/constants";
import { DiseaseListPage } from "../pages/DiseaseListPage";

export const DiseaseRoutes: React.FC = () => {
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.INFO_REQUIRED}/${INFO_REQUIRED_ROUTES.DISEASES}`;

  return (
    <>
      <Routes>
        <Route index element={<DiseaseListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<DiseaseListPage />} />
        <Route path="*" element={<Navigate to={ROUTE_INITIAL} replace />} />
      </Routes>
    </>
  );
};
