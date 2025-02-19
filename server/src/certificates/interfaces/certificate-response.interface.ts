export interface CertificateResponse {
  certificateId: string;
  certificateCode: string;
  issueDate: Date;
  certificateTypeDescription: string;
  staffName: string;
  patientDni: string;
  patientName: string;
  patientAge: number;
  restDays: string;
  diseases:
    | {
        diseaseId: number;
        diseaseDescription: string;
      }[]
    | null;
}
