import "@fontsource-variable/montserrat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CertiSaludApp from "./CertiSaludApp.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CertiSaludApp />
  </StrictMode>
);
