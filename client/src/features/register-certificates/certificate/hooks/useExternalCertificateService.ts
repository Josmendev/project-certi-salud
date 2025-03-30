import { useCallback, useState } from "react";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { showToast } from "../../../../shared/utils/toast";
import { isValidDni } from "../helpers/validateDni";
import { generateCodeCertificate, getPersonByDni } from "../repositories/certificateRepository";
import type { PersonByDniResponse } from "../types/Certificate";

export const useExternalCertificateService = () => {
  const [generateCodeForCertificate, setGenerateCodeForCertificate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Genero funcion de proc. almacenado para los certificados (valores unicos)
  const fetchCodeForCertificate = useCallback(async () => {
    try {
      setIsLoading(true);
      const code = await generateCodeCertificate();
      setGenerateCodeForCertificate(code);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Genero busqueda de dni por persona de la BD
  const searchPersonByDni = async ({ dni }: { dni: string }) => {
    if (!isValidDni(dni)) return;

    try {
      setIsLoading(true);
      const response = await getPersonByDni({ dni });

      if ("message" in response) {
        showToast({
          title: "Registro de DNI",
          description: "Debes ingresar un DNI válido",
          type: "error",
        });

        return null;
      }

      // Si no hay error, extraemos los datos
      return response as PersonByDniResponse;
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateCodeForCertificate,
    fetchCodeForCertificate,
    isLoading,
    searchPersonByDni,
  };
};
