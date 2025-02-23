import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "../../../../shared/contexts/AuthContext";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { getUsers, searchUsers, updateUser } from "../repositories/userRepository";
import { ResetPasswordUserService } from "../services/ResetPasswordUserService";
import { initialListOfResponseAPI } from "./../../../../shared/utils/constants";
import { DataOfUser } from "./../types/userTypes";

export const useUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;
  const queryClient = useQueryClient();
  const { updateUserInSession } = useContext(AuthContext);

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, searchQuery],
    queryFn: () =>
      searchQuery
        ? searchUsers({ page: currentPage, query: searchQuery })
        : getUsers({ page: currentPage }),
    placeholderData: (previousData) => previousData ?? initialListOfResponseAPI,
    refetchOnWindowFocus: false,
  });

  const handleUpdateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Recargo lista de usuarios y valido respuesta de tipo User
      queryClient.invalidateQueries({ queryKey: ["users"] });
      updateUserInSession(updatedUser);
    },
  });

  const handleResetPasswordUserMutation = useMutation({
    mutationFn: ResetPasswordUserService,
    onSuccess: () => {
      // Recargo lista de usuarios
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
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
    setSearchParams({ page: "1" });
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
