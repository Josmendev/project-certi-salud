import { Certificate } from '../entities/certificate.entity';

export const formatCertificateResponse = (certificate: Certificate) => {
  const {
    certificateId,
    certificateCode,
    issueDate,
    certificateType,
    staff,
    patient,
    restDays,
    diseases,
  } = certificate;
  const { person: staffPerson } = staff;
  const { person: patientPerson } = patient;
  return {
    certificateId,
    certificateCode,
    issueDate,
    certificateTypeDescription: certificateType.description,
    staffDni: staffPerson.identityDocumentNumber,
    staffName: `${staffPerson.name} ${staffPerson.paternalSurname} ${staffPerson.maternalSurname}`,
    patientDni: patientPerson.identityDocumentNumber,
    patientName: `${patientPerson.name} ${patientPerson.paternalSurname} ${patientPerson.maternalSurname}`,
    patientAge: patient.age,
    restDays: restDays ? `${restDays} días` : `No Aplica`,
    diseases: diseases
      ? diseases.map((disease) => ({
          diseaseCie10: disease.cie10,
          diseaseDescription: disease.description,
        }))
      : null,
  };
};
