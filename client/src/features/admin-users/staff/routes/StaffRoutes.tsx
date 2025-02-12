import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { StaffCreatePage } from "../pages/StaffCreatePage";
import { StaffDetailPage } from "../pages/StaffDetailPage";
import { StaffEditPage } from "../pages/StaffEditPage";
import { StaffListPage } from "../pages/StaffListPage";

export const StaffRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<StaffListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<StaffListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<StaffCreatePage />} />
        <Route path={CRUD_ROUTES.DETAIL} element={<StaffDetailPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<StaffEditPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
