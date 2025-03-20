import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { deletePatient } from "../repositories/patientRepository";
import type { PatientResponse } from "../types/Patient";

interface DeletePatientProps {
  queryKey: QueryKey;
  onSuccess?: (totalPages?: number) => void;
}

export const useDeletePatient = ({ queryKey, onSuccess }: DeletePatientProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (deletedPatient) => {
      const previousData = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      if (!previousData) return;

      queryClient.setQueryData(queryKey, (oldData?: DataResponseFromAPI<PatientResponse>) => {
        if (!oldData) return deletedPatient;
        const filteredData = oldData.data.filter(
          (patient) => patient.patientId !== deletedPatient.patientId
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
      const updatedQuery = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      if (updatedQuery && updatedQuery.page > 0 && updatedQuery?.totalPages > 0) {
        const { page, totalPages } = updatedQuery;
        onSuccess?.(page > totalPages ? updatedQuery?.totalPages : page);
      }
    },
  });
};
