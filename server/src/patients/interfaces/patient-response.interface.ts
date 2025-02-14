import { PersonResponse } from 'src/persons/interfaces/person-response.interface';

export interface PatientResponse {
  patientId: number;
  isActive: boolean;
  age: number;
  person: PersonResponse;
}
