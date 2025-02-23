import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { INITIAL_PAGE, LIMIT_PAGE } from "../../../../shared/utils/constants";
import { ListOfUsersService } from "../services/ListOfUsersService";
import { SearchUsersService } from "../services/SearchUsersService";
import { UpdateUserService } from "../services/UpdateUserService";
import type { DataOfUser, EditUser } from "../types/userTypes";

// Funcion para obtener todos los usuarios
export const getUsers = async ({
  limit = LIMIT_PAGE,
  page = INITIAL_PAGE,
}: {
  limit?: number;
  page: number;
}): Promise<DataResponseFromAPI<DataOfUser>> => {
  const users = await ListOfUsersService({ limit, page });
  return users;
};

// Funcion para buscar usuarios
export const searchUsers = async ({
  limit = LIMIT_PAGE,
  page = INITIAL_PAGE,
  query = "",
}: {
  limit?: number;
  page: number;
  query: string;
}): Promise<DataResponseFromAPI<DataOfUser>> => {
  const searchUsers = await SearchUsersService({ limit, page, query });
  return searchUsers;
};

// Funcion para editar un usuario
export const updateUser = async (user: EditUser): Promise<DataOfUser> => {
  const updateUser = await UpdateUserService(user);
  return updateUser;
};
