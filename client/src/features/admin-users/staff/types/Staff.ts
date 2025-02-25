import type { Person } from "../../../../shared/types/Person";

export interface Staff {
  identityDocumentNumber: number;
  name: number;
  paternalSurname: boolean;
  maternalSurname: boolean;
}

export interface StaffResponse {
  staffId: number;
  isActive: boolean;
  person: Person;
}

export type StaffUpdateRequest = Partial<Staff>;
export type StaffAssignRequest = Pick<Staff, "identityDocumentNumber">;
