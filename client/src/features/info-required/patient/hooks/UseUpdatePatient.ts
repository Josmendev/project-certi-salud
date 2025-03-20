import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { updatePatient } from "../repositories/patientRepository";
import type { PatientResponse } from "../types/Patient";

interface UpdatePatientProps {
  queryKey: QueryKey;
  onSuccess?: () => void;
}

export const useUpdatePatient = ({ queryKey, onSuccess }: UpdatePatientProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onMutate: async ({ patient, patientId }) => {
      const previousData = queryClient.getQueryData<DataResponseFromAPI<PatientResponse>>(queryKey);
      if (!previousData) return;

      queryClient.setQueryData(queryKey, (oldStaff: DataResponseFromAPI<PatientResponse>) =>
        oldStaff.data.map((currentPatient) =>
          currentPatient.patientId === patientId
            ? { ...currentPatient, ...patient }
            : currentPatient
        )
      );

      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 1), exact: false });
      onSuccess?.();
    },
  });
};
