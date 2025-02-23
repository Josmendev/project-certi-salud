import type { User } from "../../../auth/types/User";

// Creo la entrada para users
export type DataOfUser = User;
export type EditUser = Partial<DataOfUser>;
