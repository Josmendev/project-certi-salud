import { Staff } from "../entities/staff.entity";

export const formatStaffResponse = (staff: Staff) => {
  const {staffId, isActive, person} = staff;
  const { identityDocumentNumber, name, paternalSurname, maternalSurname, personId} = person;
  return {
    staffId,
    isActive,
    person: {
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
      personId,
    },
  };
} 