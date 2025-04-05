import { Navigate, Route, Routes } from "react-router";
import { DiseaseRoutes } from "../../features/info-required/disease/routes/DiseaseRoutes";
import { PatientRoutes } from "../../features/info-required/patient/routes/PatientRoutes";
import { BASE_ROUTES, INFO_REQUIRED_ROUTES } from "../../shared/utils/constants";

export const InfoRequiredRouter = () => {
  return (
    <Routes>
      <Route path={INFO_REQUIRED_ROUTES.PATIENTS + "/*"} element={<PatientRoutes />} />
      <Route path={INFO_REQUIRED_ROUTES.DISEASES + "/*"} element={<DiseaseRoutes />} />
      {/* Ruta comodín para URLs no reconocidas */}
      <Route path="*" element={<Navigate to={"/" + BASE_ROUTES.PRIVATE.DASHBOARD} replace />} />
    </Routes>
  );
};
