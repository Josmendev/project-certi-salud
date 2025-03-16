export interface CertificateResponse {
  certificateId: string;
  certificateCode: string;
  issueDate: Date;
  certificateTypeDescription: string;
  staffDni: string;
  staffName: string;
  patientDni: string;
  patientName: string;
  patientAge: number;
  restDays: string;
  diseases:
    | {
        diseaseCie10: string;
        diseaseDescription: string;
      }[]
    | null;
}
