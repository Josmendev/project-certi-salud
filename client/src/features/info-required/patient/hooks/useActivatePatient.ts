import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { activatePatient } from "../repositories/patientRepository";
import type { PatientResponse } from "../types/Patient";

interface ActivatePatientProps {
  queryKey: QueryKey;
  onSuccess?: (newPage: number) => void;
}

export const useActivatePatient = ({ queryKey, onSuccess }: ActivatePatientProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activatePatient,
    onError: (error) => {
      console.error("Error activando staff:", error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 1), exact: false });
      const updatedQuery = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      onSuccess?.(updatedQuery ? updatedQuery.totalPages : 1);
    },
  });
};
