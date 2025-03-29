import type { Person } from "../../../../shared/types/Person";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";
import type { Patient } from "../../../info-required/patient/types/Patient";

export interface Certificate extends Patient {
  issueDate: string;
  certificateTypeId: number;
  restDays: number;
  diseases: Array<Pick<DiseaseResponse, "diseaseId">>;
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
