import { ActivatePatientService } from "../services/ActivatePatientService";
import { AssignPatientService } from "../services/AssignPatientService";
import { CreatePatientService } from "../services/CreatePatientService";
import { DeletePatientService } from "../services/DeletePatientService";
import { ListPatientsService } from "../services/ListPatientsService";
import { SearchPatientsService } from "../services/SearchPatientsService";
import { UpdatePatientService } from "../services/UpdatePatientService";
import type { Patient, PatientAssignRequest, PatientResponseConditional } from "../types/Patient";

//Funcion para agregar patient
export const createPatient = async ({ patient }: { patient: Patient }) => {
  const response = await CreatePatientService({ patient });

  // Controlo a persona registrado como personal y desea pasar a paciente
  if ("DNI" in response && response.message.endsWith("registrada como personal")) {
    return {
      isStaffToAssignPacient: true,
      DNI: response.DNI,
    } as PatientResponseConditional;
  }

  // Controlo a paciente registrado, pero eliminado
  if ("DNI" in response && response.message.endsWith("se encuentra desactivado")) {
    return {
      isPatientDesactivated: true,
      DNI: response.DNI,
      patientId: response.patientId,
    } as PatientResponseConditional;
  }

  // Controlo a paciente registrado
  if ("DNI" in response && response.message.endsWith("se encuentra registrado")) {
    return { isRegistered: true, DNI: response.DNI } as PatientResponseConditional;
  }

  return response;
};

// Funcion para obtener y buscar patients
export const getPatients = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query
    ? SearchPatientsService({ limit, page, query })
    : ListPatientsService({ limit, page });
};

// Funcion para actualizar un patient
export const updatePatient = async ({
  patient,
  patientId,
}: {
  patient: Patient;
  patientId: number;
}) => {
  const updatedPatient = await UpdatePatientService({ patient, patientId });
  return updatedPatient;
};

// Funcion para eliminar un patient
export const deletePatient = async ({ patientId }: { patientId: number }) => {
  await DeletePatientService({ patientId });
};

// Funcion para activar un patient
export const activatePatient = async ({ patientId }: { patientId: number }) => {
  await ActivatePatientService({ patientId });
};

// Funcion para asignar un patient
export const assignPatient = async ({ patient }: { patient: PatientAssignRequest }) => {
  await AssignPatientService({ patient });
};
