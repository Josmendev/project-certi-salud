import type { IPerson } from "../../../../shared/types/Person";
import type { IUser } from "../../../auth/types/User";

export type DataOfUser = IUser & IPerson;

export type EditUser = Partial<DataOfUser>;

export interface ResponseDataUser {
  data: Array<DataOfUser>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
