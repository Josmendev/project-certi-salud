import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../../shared/contexts/AuthContext";
import { getUsers } from "../helpers/getUsers";
import { searchUsers } from "../helpers/searchUsers";
import { updateUser } from "../helpers/updateUser";
import { ResetPasswordUserService } from "../services/ResetPasswordUserService";
import { initialDataOfUsers } from "../utils/constants";

export const useQueriesUsers = ({
  currentPage,
  searchQuery,
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const queryClient = useQueryClient();
  const { updateUserInSession } = useContext(AuthContext);

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
    refetchOnWindowFocus: false, // Evito la recarga automática al volver a la ventana
  });

  const handleUpdateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Recargar lista de usuarios
      updateUserInSession(updatedUser);
    },
  });

  const handleResetPasswordUserMutation = useMutation({
    mutationFn: ResetPasswordUserService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // 🔄 Recargar lista de usuarios
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    handleUpdateUserMutation,
    handleResetPasswordUserMutation,
  };
};
