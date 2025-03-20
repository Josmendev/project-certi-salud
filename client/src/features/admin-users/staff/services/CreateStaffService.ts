import { getDNI } from "../../../../shared/helpers/getDNI";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import type { Staff, StaffResponse } from "../types/Staff";
import { ENDPOINT_STAFF } from "../utils/endpoints";

// Creo la funcion createStaff que se conecta a la API del backend
export const CreateStaffService = async ({
  staff,
}: {
  staff: Staff;
}): Promise<StaffResponse | { DNI: string; message: string; staffId?: number }> => {
  try {
    const { token } = JSON.parse(sessionStorage.getItem("user") as string);
    if (!token) throw new Error("Token inválido");

    const response = await fetch(`${ENDPOINT_STAFF}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(staff),
    });

    // Respuesta no exitosa, lanzo excepcion del backend
    if (!response.ok) {
      const errorResponse = await response.json();
      const messageResponse = errorResponse.message[0];
      const messageWithStaffId = errorResponse.message[1] ?? "";
      // Manejo de casos específicos del backend
      if (response.status === 400 && messageResponse.includes("DNI")) {
        const DNI = getDNI(messageResponse);
        return { DNI, message: messageResponse, staffId: messageWithStaffId };
      }

      throw errorResponse;
    }

    // Respuesta exitosa, parseo el JSON y devuelvo el objeto StaffResponse
    const data: StaffResponse = await response.json();
    return data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject(error);
  }
};
