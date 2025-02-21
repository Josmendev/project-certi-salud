import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { SearchUsersService } from "../services/SearchUsersService";
import type { DataOfUser } from "../types/userTypes";

export const searchUsers = async ({
  limit = LIMIT_PAGE,
  page = 1,
  query = "",
}): Promise<DataResponseFromAPI<DataOfUser>> => {
  const responseOfUsers = await SearchUsersService(limit, page, query);
  if (!("data" in responseOfUsers)) throw new Error("No se encontraron usuarios");
  return responseOfUsers;
};
