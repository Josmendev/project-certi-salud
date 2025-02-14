import { ListOfUsersService } from "../services/ListOfUsersService";

interface GetUsersProps {
  limit?: number;
  page?: number;
}

export const getUsers = async ({ limit = 8, page = 1 }: GetUsersProps) => {
  const allUsers = await ListOfUsersService(limit, page);
  return allUsers;
};
