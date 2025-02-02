import { PersonReniec } from "src/common/entities/person-reniec.entity";

export const formatPersonByDniResponse = (person: PersonReniec) => {
  const { numero, nombres, apellido_paterno, apellido_materno } = person.data;
  return {
    identityDocumentNumber: numero,
    name: nombres,
    paternalSurname: apellido_paterno,
    maternalSurname: apellido_materno
  };
}