import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { initialListOfResponseAPI } from "../../../../shared/utils/constants";
import { getDiseases } from "../repositories/diseaseRepository";

export const useDisease = ({
  currentPage,
  searchQuery = "",
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const diseaseQueryKey = ["diseases", currentPage, searchQuery];

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: diseaseQueryKey,
    queryFn: () => getDiseases({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    currentPage,
  };
};
