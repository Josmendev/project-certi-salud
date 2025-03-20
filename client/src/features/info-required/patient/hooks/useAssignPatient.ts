import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { assignPatient } from "../repositories/patientRepository";
import type { PatientResponse } from "../types/Patient";

interface ActivatePatientProps {
  queryKey: QueryKey;
  onSuccess?: (newTotalPages?: number) => void;
}

export const useAssignPatient = ({ queryKey, onSuccess }: ActivatePatientProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignPatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      const updatedQuery = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      onSuccess?.(updatedQuery?.totalPages);
    },

    onError: (error) => {
      console.error("Error asignando patient:", error);
    },
  });
};
