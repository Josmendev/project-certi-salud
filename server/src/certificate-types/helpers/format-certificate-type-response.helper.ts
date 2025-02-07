import { CertificateType } from '../entities/certificate-type.entity';

export const formatCertificateTypeResponse = (
  certificateType: CertificateType,
) => {
  const { createdAt, updatedAt, ...certificateTypeData } = certificateType;
  return certificateTypeData;
};
