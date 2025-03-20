import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePagination } from "../../../../shared/hooks/usePagination";
import type { PatientResponse } from "../types/Patient";
import { usePatient } from "./usePatient";

export const usePatientManagement = () => {
  // 📌 Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentPage: pageOfPagination,
    searchQuery,
    handlePageChange,
    handleSearch,
  } = usePagination();
  const currentPage = location.state?.pageOfPatient ?? pageOfPagination ?? 1;

  const { MAIN_ROUTE, handleDeletePatientMutation } = usePatient({ currentPage, searchQuery });

  const handleUpdatePatientInRow = useCallback(
    (data: PatientResponse) => {
      if (!data?.patientId) return;
      navigate(`${MAIN_ROUTE}/${data.patientId}/edit`, {
        state: { patient: data, pageOfPatient: currentPage },
      });
    },
    [navigate, MAIN_ROUTE, currentPage]
  );

  const handleDeletePatientInRow = useCallback(
    async (data: PatientResponse) => {
      if (!data?.patientId) return;
      await handleDeletePatientMutation.mutateAsync({ patientId: data.patientId });
    },
    [handleDeletePatientMutation]
  );

  const handleCreatePatient = useCallback(() => {
    navigate(`${MAIN_ROUTE}/add`, { state: { pageOfPatient: currentPage } });
  }, [navigate, MAIN_ROUTE, currentPage]);

  return {
    MAIN_ROUTE,
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    handleCreatePatient,
    handleDeletePatientInRow,
    handleUpdatePatientInRow,
  };
};
