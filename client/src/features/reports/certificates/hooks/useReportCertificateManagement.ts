import { useCallback, useState } from "react";
import { usePagination } from "../../../../shared/hooks/usePagination";
import type { CertificateResponse } from "../../../register-certificates/certificate/types/Certificate";
import {
  getAllReportsInCertificate,
  getReportByIdInCertificate,
} from "../repositories/reportsRepository";
import { useReportCertificate } from "./useReportCertificate";

export const useReportCertificateManagement = () => {
  const { currentPage, searchQuery } = usePagination();
  const { handleDeleteCertificateMutation } = useReportCertificate({ currentPage, searchQuery });
  const [isLoadingAllCertificates, setIsLoadingAllCertificates] = useState<boolean>(false);
  const [isLoadingByIdCertificate, setIsLoadingByIdCertificate] = useState<boolean>(false);

  const handleDeleteCertificateInRow = useCallback(
    async (data: CertificateResponse) => {
      if (!data?.certificateId) return;
      await handleDeleteCertificateMutation.mutateAsync({ certificateId: data.certificateId });
    },
    [handleDeleteCertificateMutation]
  );

  // Abro los PDF en una nueva pestaña
  const handleGenerateCertificateInPdf = useCallback(async () => {
    setIsLoadingAllCertificates(true);

    try {
      const pdfUrl = await getAllReportsInCertificate();
      window.open(pdfUrl, "_blank");
    } finally {
      setIsLoadingAllCertificates(false);
    }
  }, []);

  const handleGenerateCertificateByIdInPdf = useCallback(
    async ({ reportId }: { reportId: string }) => {
      setIsLoadingByIdCertificate(true);

      try {
        const pdfUrl = await getReportByIdInCertificate({ reportId });
        window.open(pdfUrl, "_blank");
      } finally {
        setIsLoadingByIdCertificate(false);
      }
    },
    []
  );

  return {
    isLoadingAllCertificates,
    isLoadingByIdCertificate,
    handleDeleteCertificateInRow,
    handleGenerateCertificateInPdf,
    handleGenerateCertificateByIdInPdf,
  };
};
