import { PersonResponse } from "src/persons/interfaces/person-response.interface";

export interface StaffResponse {
  staffId: number;
  isActive: boolean;
  person: PersonResponse;
}

