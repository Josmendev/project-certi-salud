import "@fontsource-variable/montserrat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import CertiSaludApp from "./CertiSaludApp.tsx";
import "./index.css";
import { AuthProvider } from "./shared/providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      offset={{ bottom: "24px", right: "24px", left: "24px" }}
      mobileOffset={{ bottom: "16px" }}
      visibleToasts={6}
      richColors
      gap={6}
      className="text-left"
      toastOptions={{ style: { gap: "1.25rem" } }}
    />
    <BrowserRouter>
      <AuthProvider>
        <CertiSaludApp />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
