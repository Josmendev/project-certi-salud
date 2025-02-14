import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { DiseaseCreatePage } from "../pages/DiseaseCreatePage";
import { DiseaseDetailPage } from "../pages/DiseaseDetailPage";
import { DiseaseEditPage } from "../pages/DiseaseEditPage";
import { DiseaseListPage } from "../pages/DiseaseListPage";

export const DiseaseRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<DiseaseListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<DiseaseListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<DiseaseCreatePage />} />
        <Route path={CRUD_ROUTES.DETAIL} element={<DiseaseDetailPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<DiseaseEditPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
