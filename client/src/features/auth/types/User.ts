import type { IPerson } from "../../../shared/types/Person";

export interface IUser {
  userId: number;
  username: string;
  isConfirm: boolean;
  isActive: boolean;
  person: IPerson;
  role: Array<string>;
}
