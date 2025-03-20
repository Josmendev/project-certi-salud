import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { createPatient } from "../repositories/patientRepository";
import type { PatientResponse, PatientResponseConditional } from "../types/Patient";

interface CreatePatientProps {
  queryKey: QueryKey;
  onSuccess?: (
    response?: PatientResponse | PatientResponseConditional,
    totalPages?: number
  ) => void;
}

export const useCreatePatient = ({ queryKey, onSuccess }: CreatePatientProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onMutate: async ({ patient }) => {
      const previousData = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      if (!previousData) return;

      // Staffid and isActive, son de prueba, es para mantener la estructura de PatientResponse.
      const newStaff = {
        staffId: Date.now(),
        isActive: true,
        person: patient,
      };

      // Calculo optimistamente el nuevo totalPages
      const updatedDataCount = previousData.data.length + 1;
      const limitForPage = previousData.limit ?? LIMIT_PAGE;
      const mustIncrementTotalPages = updatedDataCount > limitForPage;
      const newTotalPages = mustIncrementTotalPages
        ? previousData.totalPages + 1
        : previousData.totalPages;

      queryClient.setQueryData(queryKey, (oldData: DataResponseFromAPI<PatientResponse>) => ({
        ...oldData,
        data: [...oldData.data, newStaff],
        totalPages: newTotalPages,
      }));

      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
    },

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey });
      const updatedQuery = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      onSuccess?.(response, updatedQuery?.totalPages);
    },
  });
};
