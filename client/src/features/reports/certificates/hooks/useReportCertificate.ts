import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  BASE_ROUTES,
  initialListOfResponseAPI,
  REPORT_CERTIFICATE_ROUTES,
} from "../../../../shared/utils/constants";
import { getAllCertificatesInReports } from "../repositories/reportsRepository";
import { useDeleteCertificate } from "./useDeleteCertificate";

export const useReportCertificate = ({
  currentPage,
  searchQuery = "",
}: {
  currentPage: number;
  searchQuery: string;
}) => {
  const navigate = useNavigate();
  const MAIN_REPORTS_ROUTE = `/${BASE_ROUTES.PRIVATE.REPORTS}/${REPORT_CERTIFICATE_ROUTES.REPORT}`;
  const certificateQuery = ["reports-certificates", currentPage, searchQuery];

  const {
    data = initialListOfResponseAPI,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: certificateQuery,
    queryFn: () => getAllCertificatesInReports({ page: currentPage, query: searchQuery }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const handleDeleteCertificateMutation = useDeleteCertificate({
    queryKey: certificateQuery,
    onSuccess: (newPage) => {
      navigate(`${MAIN_REPORTS_ROUTE}?page=${newPage}`);
    },
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    handleDeleteCertificateMutation,
  };
};
