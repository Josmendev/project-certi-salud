import { PersonResponse } from 'src/persons/interfaces/person-response.interface';

export interface ValidateUserResponse {
  userId: number;
  staffId: number;
  person: PersonResponse;
  role: string[];
}
