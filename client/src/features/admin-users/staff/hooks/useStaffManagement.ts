import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import type { StaffResponse } from "../types/Staff";
import { useStaff } from "./useStaff";

export const useStaffManagement = () => {
  // 📌 Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const MAIN_ROUTE = `/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.STAFF}`;
  const {
    currentPage: pageOfPagination,
    searchQuery,
    handlePageChange,
    handleSearch,
  } = usePagination();
  const currentPage = location.state?.pageOfStaff ?? pageOfPagination ?? 1;

  const { handleDeleteStaffMutation } = useStaff({ currentPage, searchQuery });

  const handleUpdateStaffInRow = useCallback(
    (data: StaffResponse) => {
      if (!data?.staffId) return;
      navigate(`${MAIN_ROUTE}/${data.staffId}/edit`, {
        state: { staff: data, pageOfStaff: currentPage },
      });
    },
    [navigate, MAIN_ROUTE, currentPage]
  );

  const handleDeleteStaffInRow = useCallback(
    async (data: StaffResponse) => {
      if (!data?.staffId) return;
      await handleDeleteStaffMutation.mutateAsync({ staffId: data.staffId });
    },
    [handleDeleteStaffMutation]
  );

  const handleCreateStaff = useCallback(() => {
    navigate(`${MAIN_ROUTE}/add`, { state: { pageOfStaff: currentPage } });
  }, [navigate, MAIN_ROUTE, currentPage]);

  return {
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    MAIN_ROUTE,
    handleCreateStaff,
    handleUpdateStaffInRow,
    handleDeleteStaffInRow,
  };
};
