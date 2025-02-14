import { SeedData } from '../interfaces/seed-data.interface';

export const initialData: SeedData = {
  roles: [
    {
      roleId: 1,
      description: 'Administrador',
    },
    {
      roleId: 2,
      description: 'Registrador',
    },
  ],
  staff: [
    {
      identityDocumentNumber: '70125834',
      name: 'Jose',
      paternalSurname: 'Menacho',
      maternalSurname: 'Minchola',
    },
  ],
  patients: [
    {
      identityDocumentNumber: '00112233',
      name: 'Carlos',
      paternalSurname: 'Teran',
      maternalSurname: 'Zavaleta',
      age: 30,
    },
  ],
};
