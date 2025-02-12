import type React from "react";
import { Navigate, Route, Routes } from "react-router";
import { CRUD_ROUTES } from "../../../../shared/utils/constants";
import { RoleCreatePage } from "../pages/RoleCreatePage";
import { RoleDetailPage } from "../pages/RoleDetailPage";
import { RoleEditPage } from "../pages/RoleEditPage";
import { RoleListPage } from "../pages/RoleListPage";

export const RoleRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<RoleListPage />} />
        <Route path={CRUD_ROUTES.LIST} element={<RoleListPage />} />
        <Route path={CRUD_ROUTES.ADD} element={<RoleCreatePage />} />
        <Route path={CRUD_ROUTES.DETAIL} element={<RoleDetailPage />} />
        <Route path={CRUD_ROUTES.EDIT} element={<RoleEditPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
