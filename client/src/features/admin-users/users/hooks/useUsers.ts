import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import type { DataOfUser } from "../types/userTypes";
import { useQueriesUsers } from "./useQueriesUser";

export const useUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    data,
    isLoading,
    isError,
    error,
    handleUpdateUserMutation,
    handleResetPasswordUserMutation,
  } = useQueriesUsers({
    currentPage,
    searchQuery,
  });

  const handleEditRow = (data: DataOfUser) => {
    navigate(`/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}/${data.userId}/edit`, {
      state: { user: data, page: currentPage },
    });
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ page: "1" }); // Reiniciar a la página 1 en nueva búsqueda
  };

  return {
    data,
    currentPage,
    isLoading,
    isError,
    error,
    handleUpdateUserMutation,
    handleResetPasswordUserMutation,
    handleEditRow,
    handlePageChange,
    handleSearch,
  };
};
