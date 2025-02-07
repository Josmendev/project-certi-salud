import { PersonResponse } from 'src/persons/interfaces/person-response.interface';

export class UserResponse {
  userId: number;
  username: string;
  isConfirm: boolean;
  isActive: boolean;
  person: PersonResponse;
  role: string[];
}
