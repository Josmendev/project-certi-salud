import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { initialListOfResponseAPI } from "../../../../shared/utils/constants";
import {
  activateRole,
  createRole,
  deleteRole,
  searchRoles,
  updateRole,
} from "../repositories/roleRepository";
import { getRoles } from "./../repositories/roleRepository";

export const useRoles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roles", currentPage, searchQuery],
    queryFn: () =>
      searchQuery
        ? searchRoles({ page: currentPage, query: searchQuery })
        : getRoles({ page: currentPage }),
    placeholderData: (previousData) => previousData ?? initialListOfResponseAPI,
    refetchOnWindowFocus: false,
  });

  const handleCreateRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const handleUpdateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const handleDeleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const handleActivateRoleMutation = useMutation({
    mutationFn: activateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const handlePageChangeInRole = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  const handleSearchRole = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ page: "1" });
  };

  return {
    data,
    isLoading,
    isError,
    error,
    currentPage,
    handlePageChangeInRole,
    handleSearchRole,
    handleCreateRoleMutation,
    handleUpdateRoleMutation,
    handleDeleteRoleMutation,
    handleActivateRoleMutation,
  };
};
