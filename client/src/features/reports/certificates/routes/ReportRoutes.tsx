import { Navigate, Route, Routes } from "react-router";
import { ReportPage } from "../pages/ReportPage";
import { REPORT_CERTIFICATE_ROUTES } from "../utils/constants";

export const ReportRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<ReportPage />} />
        <Route path={"/" + REPORT_CERTIFICATE_ROUTES.REPORT} element={<ReportPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};
