import { getNumbersInString } from "../../../../shared/helpers/getNumbersInString";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { Patient, PatientResponse } from "../types/Patient";
import { ENDPOINT_PATIENT } from "../utils/endpoints";

// Creo la funcion createPatient que se conecta a la API del backend
export const CreatePatientService = async ({
  patient,
}: {
  patient: Patient;
}): Promise<PatientResponse | { DNI: string; message: string; patientId?: number }> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_PATIENT}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(patient),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) {
      const errorResponse = await response.json();
      const firstMessageResponse = errorResponse.message[0];
      const secondMessageResponse = errorResponse.message[1] ?? "";
      // Manejo de casos específicos del backend
      if (response.status === 400 && firstMessageResponse.includes("DNI")) {
        const DNI = getNumbersInString(firstMessageResponse)?.[0];
        if (!DNI) return Promise.reject("No se encontró un DNI");

        return { DNI, message: firstMessageResponse, patientId: secondMessageResponse };
      }

      throw errorResponse;
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto PatientResponse
    const data: PatientResponse = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
