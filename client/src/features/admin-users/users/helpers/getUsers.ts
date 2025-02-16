import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { ListOfUsersService } from "../services/ListOfUsersService";
import type { DataOfUsers } from "../types/userTypes";

interface GetUsers {
  limit?: number;
  page: number;
}

export const getUsers = async ({
  limit = LIMIT_PAGE,
  page,
}: GetUsers): Promise<DataResponseFromAPI<DataOfUsers>> => {
  const responseOfUsers = await ListOfUsersService(limit, page);
  if (!("data" in responseOfUsers)) throw new Error("No se pudo obtener la lista de usuarios");
  return responseOfUsers;
};
