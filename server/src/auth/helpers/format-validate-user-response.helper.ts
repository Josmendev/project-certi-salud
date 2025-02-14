import { User } from 'src/users/entities/user.entity';

export const formatValidateUserResponse = (user: User) => ({
  userId: user.userId,
  username: user.username,
  staffId: user.staff.staffId,
  person: {
    personId: user.staff.person.personId,
    identityDocumentNumber: user.staff.person.identityDocumentNumber,
    name: user.staff.person.name,
    paternalSurname: user.staff.person.paternalSurname,
    maternalSurname: user.staff.person.maternalSurname,
  },
  role: user.role.map((role) => role.description),
});
