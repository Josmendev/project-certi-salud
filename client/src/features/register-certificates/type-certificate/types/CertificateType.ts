export interface CertificateType {
  description: string;
}

export interface CertificateTypeResponse {
  certificateTypeId: number;
  description: string;
  isActive: boolean;
}

export type UpdateCertificateTypeSelected = {
  selectedCertificateType: CertificateTypeResponse | null;
  clearSelectedCertificateType: () => void;
};
