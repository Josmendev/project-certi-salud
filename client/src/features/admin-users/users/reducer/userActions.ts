import type { ErrorResponse } from "../../../../shared/types/ErrorResponse";
import type { EditUser, ResponseDataUser } from "../types/userTypes";
import { USER_TYPES } from "./userReducerTypes";

// Defino el action con payload (only: type, payload)
interface Action<Type, Payload> {
  type: Type;
  payload: Payload;
}

// Definir UserAction usando las interfaces genéricas
export type UserAction =
  | Action<typeof USER_TYPES.listOfUsers, ResponseDataUser | ErrorResponse | null>
  | Action<typeof USER_TYPES.editUser, EditUser | ErrorResponse | null>;
