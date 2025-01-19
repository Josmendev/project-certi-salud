export const formatStaffResponse = (personStaff: any) => {
  const {identityDocumentNumber, name, paternalSurname, maternalSurname, personId, staff} = personStaff;
  const {staffId, isActive} = staff;
  return {
    staffId: staffId,
    isActive: isActive,
    person: {
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
      personId,
    },
  };
} 