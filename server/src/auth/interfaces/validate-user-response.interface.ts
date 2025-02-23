import { PersonResponse } from 'src/persons/interfaces/person-response.interface';

export interface ValidateUserResponse {
  userId: number;
  username: string;
  staffId: number;
  person: PersonResponse;
  role: string[];
}
