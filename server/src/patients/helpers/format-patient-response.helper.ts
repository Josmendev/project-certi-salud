import { Patient } from '../entities/patient.entity';

export const formatPatientResponse = (patient: Patient) => {
  const { patientId, age, isActive, person } = patient;
  const {
    identityDocumentNumber,
    name,
    paternalSurname,
    maternalSurname,
    personId,
  } = person;
  return {
    patientId,
    isActive,
    age,
    person: {
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
      personId,
    },
  };
};
