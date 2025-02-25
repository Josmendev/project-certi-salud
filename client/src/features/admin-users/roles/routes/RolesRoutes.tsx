import type React from "react";
import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { RoleListPage } from "../pages/RoleListPage";

export const RoleRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<RoleListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<RoleListPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
