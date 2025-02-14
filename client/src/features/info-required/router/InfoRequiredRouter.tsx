import { Route, Routes } from "react-router";
import { DiseaseRoutes } from "../disease/routes/DiseaseRoutes";
import { PatientRoutes } from "../patient/routes/PatientRoutes";
import { INFO_REQUIRED_ROUTES } from "../utils/constants";

export const InfoRequiredRouter = () => {
  return (
    <Routes>
      <Route path={INFO_REQUIRED_ROUTES.PATIENTS + "/*"} element={<PatientRoutes />} />
      <Route path={INFO_REQUIRED_ROUTES.DISEASES + "/*"} element={<DiseaseRoutes />} />
    </Routes>
  );
};
