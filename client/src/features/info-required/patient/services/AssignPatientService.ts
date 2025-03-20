import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { PatientAssignRequest, PatientResponse } from "../types/Patient";
import { ENDPOINT_PATIENT } from "../utils/endpoints";

// Creo la funcion AssignPatient que se conecta a la API del backend
export const AssignPatientService = async ({
  patient,
}: {
  patient: PatientAssignRequest;
}): Promise<PatientResponse> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_PATIENT}/assign`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(patient),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) throw await response.json();

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto PatientResponse
    const data: PatientResponse = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
