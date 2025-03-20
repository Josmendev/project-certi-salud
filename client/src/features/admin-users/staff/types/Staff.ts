import type { Person } from "../../../../shared/types/Person";

//Types of Request
export type Staff = Omit<Person, "personId">;
export type StaffAssignRequest = Pick<Person, "identityDocumentNumber">;

//Types of Response
export interface StaffResponse {
  staffId: number;
  isActive: boolean;
  person: Person;
}

export interface StaffResponseConditional {
  DNI: string;
  staffId?: number;
  isPacientToAssignStaff?: boolean;
  isStaffDesactivated?: boolean;
  isRegistered?: boolean;
}
