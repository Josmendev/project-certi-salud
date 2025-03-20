import type { Person } from "../../../../shared/types/Person";

export interface Patient extends Omit<Person, "personId"> {
  age: number;
}

export type PatientAssignRequest = Pick<Patient, "identityDocumentNumber" | "age">;

export interface PatientResponse {
  patientId: number;
  isActive: boolean;
  age: number;
  person: Person;
}

export interface PatientResponseConditional {
  DNI: string;
  patientId?: number;
  isStaffToAssignPacient?: boolean;
  isPatientDesactivated?: boolean;
  isRegistered?: boolean;
}
