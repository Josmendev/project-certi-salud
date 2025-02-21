import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import type { DataOfUser } from "../types/userTypes";

export const initialDataOfUsers: DataResponseFromAPI<DataOfUser> = {
  data: [] as DataOfUser[],
  limit: 5,
  page: 1,
  total: 1,
  totalPages: 1,
};
