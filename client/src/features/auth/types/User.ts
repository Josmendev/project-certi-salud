import type { IPerson } from "../../../shared/types/Person";
import { ROLES_KEYS, ROLES_VALUES } from "./../../../shared/utils/constants";

export interface IUser {
  userId: number;
  username: string;
  isConfirm: boolean;
  isActive: boolean;
  person: IPerson;
  role: Array<ROLES_KEYS> | Array<ROLES_VALUES>;
}
