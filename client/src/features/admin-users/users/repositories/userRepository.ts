import type { User } from "../../../auth/types/User";
import { ListOfUsersService } from "../services/ListOfUsersService";
import { SearchUsersService } from "../services/SearchUsersService";
import { UpdateUserService } from "../services/UpdateUserService";
import type { EditUser } from "../types/userTypes";

// Funcion para obtener y buscar todos los users
export const getUsers = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query ? SearchUsersService({ limit, page, query }) : ListOfUsersService({ limit, page });
};

// Funcion para editar un usuario
export const updateUser = async (user: EditUser): Promise<User> => {
  const updateUser = await UpdateUserService(user);
  return updateUser;
};
