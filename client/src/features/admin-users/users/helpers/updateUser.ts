import { UpdateUserService } from "../services/UpdateUserService";
import type { DataOfUser, EditUser } from "../types/userTypes";

export const updateUser = async (user: EditUser): Promise<DataOfUser> => {
  const responseOfUsers = await UpdateUserService(user);
  if (!("userId" in responseOfUsers)) throw new Error("No se pudo editar al usuario");
  return responseOfUsers as DataOfUser;
};
