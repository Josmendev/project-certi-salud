import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { DiseaseListPage } from "../pages/DiseaseListPage";

export const DiseaseRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<DiseaseListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<DiseaseListPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
