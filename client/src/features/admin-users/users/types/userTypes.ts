import type { IUser } from "../../../auth/types/User";

// Creo la entrada para users
export type DataOfUser = IUser;
export type EditUser = Partial<DataOfUser>;
