import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialListOfResponseAPI } from "../../../../shared/utils/constants";
import {
  activateCertificateType,
  createCertificateType,
  deleteCertificateType,
  getCertificateTypes,
  updateCertificateType,
} from "../repositories/certificateTypeRepository";

export const useCertificateTypes = ({
  currentPage,
  searchQuery = "",
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const queryClient = useQueryClient();
  const queryKey = ["certificateTypes", currentPage, searchQuery];

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => getCertificateTypes({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const handleCreateCertificateTypeMutation = useMutation({
    mutationFn: createCertificateType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleUpdateCertificateTypeMutation = useMutation({
    mutationFn: updateCertificateType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleDeleteCertificateTypeMutation = useMutation({
    mutationFn: deleteCertificateType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleActivateCertificateTypeMutation = useMutation({
    mutationFn: activateCertificateType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    handleCreateCertificateTypeMutation,
    handleUpdateCertificateTypeMutation,
    handleDeleteCertificateTypeMutation,
    handleActivateCertificateTypeMutation,
  };
};
