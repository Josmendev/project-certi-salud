import type { Person } from "../../../../shared/types/Person";
import type { Patient } from "../../../info-required/patient/types/Patient";

export interface Certificate extends Patient {
  issueDate: string | Date;
  certificateTypeId: number;
  restDays: number;
  diseases: Array<number>;
}

export type PersonByDniResponse = Omit<Person, "personId">;

export interface DiseaseInCertificate {
  diseaseCie10: string;
  diseaseDescription: string;
}

export interface CertificateResponse {
  certificateId: number;
  certificateCode: string;
  certificateTypeDescription: string;
  staffDni: string;
  staffName: string;
  patientDni: string;
  patientName: string;
  patientAge: number;
  restDays: string;
  diseases: Array<DiseaseInCertificate>;
}
