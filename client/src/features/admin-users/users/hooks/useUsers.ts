import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { getUsers } from "../helpers/getUsers";
import { searchUsers } from "../helpers/searchUsers";
import { initialDataOfUsers } from "../utils/constants";

export const useUsers = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data = initialDataOfUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, searchQuery],
    queryFn: () =>
      searchQuery
        ? searchUsers({ query: searchQuery, page: currentPage })
        : getUsers({ page: currentPage }),
    placeholderData: (previousData) => previousData ?? initialDataOfUsers,
  });

  const handleEditRow = useCallback(
    (idRow: number) => {
      navigate(`/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}/${idRow}/edit`);
    },
    [navigate]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page ?? 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reiniciar a la página 1 en nueva búsqueda
  };

  return {
    data,
    currentPage,
    isLoading,
    isError,
    error,
    handleEditRow,
    handlePageChange,
    handleSearch,
  };
};
