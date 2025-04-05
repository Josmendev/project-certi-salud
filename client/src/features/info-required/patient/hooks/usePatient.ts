import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  BASE_ROUTES,
  INFO_REQUIRED_ROUTES,
  initialListOfResponseAPI,
} from "../../../../shared/utils/constants";
import { getPatients } from "../repositories/patientRepository";
import { useActivatePatient } from "./useActivatePatient";
import { useAssignPatient } from "./useAssignPatient";
import { useCreatePatient } from "./useCreatePatient";
import { useDeletePatient } from "./useDeletePatient";
import { useUpdatePatient } from "./UseUpdatePatient";

export const usePatient = ({
  currentPage,
  searchQuery = "",
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const navigate = useNavigate();
  const MAIN_ROUTE = `/${BASE_ROUTES.PRIVATE.INFO_REQUIRED}/${INFO_REQUIRED_ROUTES.PATIENTS}`;
  const patientQueryKey = ["patients", currentPage, searchQuery];

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: patientQueryKey,
    queryFn: () => getPatients({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const handleCreatePatientMutation = useCreatePatient({
    queryKey: patientQueryKey,
    onSuccess: (response, newPage) => {
      if (response && !("DNI" in response)) {
        navigate(`${MAIN_ROUTE}?page=${newPage}`);
      }
    },
  });

  const handleAssignPatientMutation = useAssignPatient({
    queryKey: patientQueryKey,
    onSuccess: (newPage) => {
      navigate(`${MAIN_ROUTE}?page=${newPage}`);
    },
  });

  const handleActivatePatientMutation = useActivatePatient({
    queryKey: patientQueryKey,
    onSuccess: (newPage) => {
      navigate(`${MAIN_ROUTE}?page=${newPage}`);
    },
  });

  const handleUpdatePatientMutation = useUpdatePatient({
    queryKey: patientQueryKey,
    onSuccess: () => {
      navigate(-1);
    },
  });

  const handleDeletePatientMutation = useDeletePatient({
    queryKey: patientQueryKey,
    onSuccess: (newPage) => {
      navigate(`${MAIN_ROUTE}?page=${newPage}`);
    },
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    currentPage,
    MAIN_ROUTE,
    handleCreatePatientMutation,
    handleActivatePatientMutation,
    handleAssignPatientMutation,
    handleUpdatePatientMutation,
    handleDeletePatientMutation,
  };
};
