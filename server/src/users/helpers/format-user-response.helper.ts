import { User } from '../entities/user.entity';

export const formatUserResponse = (user: User) => {
  const { userId, username, isConfirm, isActive, staff, role } = user;
  const { person } = staff;
  const {
    personId,
    identityDocumentNumber,
    name,
    paternalSurname,
    maternalSurname,
  } = person;
  return {
    userId,
    username,
    isConfirm,
    isActive,
    person: {
      personId,
      identityDocumentNumber,
      name,
      paternalSurname,
      maternalSurname,
    },
    role: role.map((role) => role.description),
  };
};
