import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import type { CertificateResponse } from "../../../register-certificates/certificate/types/Certificate";
import { deleteCertificate } from "../repositories/reportsRepository";

interface DeleteCertificateProps {
  queryKey: QueryKey;
  onSuccess?: (totalPages?: number) => void;
}

export const useDeleteCertificate = ({ queryKey, onSuccess }: DeleteCertificateProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCertificate,
    onMutate: async (deletedCertificate) => {
      const previousData =
        queryClient.getQueryData<DataResponseFromAPI<CertificateResponse>>(queryKey);
      if (!previousData) return;

      queryClient.setQueryData(queryKey, (oldData?: DataResponseFromAPI<CertificateResponse>) => {
        if (!oldData) return deletedCertificate;
        const filteredData = oldData.data.filter(
          (certificate) => certificate.certificateId !== deletedCertificate.certificateId
        );

        // Calculo optimistamente el nuevo totalPages
        const updatedDataCount = previousData.data.length - 1;
        const mustIncrementTotalPages = updatedDataCount <= 0;
        const newTotalPages = mustIncrementTotalPages
          ? previousData.totalPages - 1
          : previousData.totalPages;

        return {
          ...oldData,
          data: filteredData,
          totalPages: newTotalPages,
        };
      });

      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 1), exact: false });
      const updatedQuery =
        queryClient.getQueryData<DataResponseFromAPI<CertificateResponse>>(queryKey);
      if (updatedQuery && updatedQuery.page > 0 && updatedQuery?.totalPages > 0) {
        const { page, totalPages } = updatedQuery;
        onSuccess?.(page > totalPages ? updatedQuery?.totalPages : page);
      }
    },
  });
};
