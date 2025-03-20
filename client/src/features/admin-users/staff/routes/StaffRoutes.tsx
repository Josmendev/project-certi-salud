import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { StaffListPage } from "../pages/StaffListPage";
import { StaffUpsertPage } from "../pages/StaffUpsertPage";

export const StaffRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<StaffListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<StaffListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<StaffUpsertPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<StaffUpsertPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
