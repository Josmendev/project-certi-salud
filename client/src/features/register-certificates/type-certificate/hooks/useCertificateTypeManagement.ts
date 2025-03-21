import { useCallback, useState } from "react";
import { usePagination } from "../../../../shared/hooks/usePagination";
import type {
  CertificateTypeResponse,
  UpdateCertificateTypeSelected,
} from "../types/CertificateType";
import { useCertificateTypes } from "./useCertificateTypes";

export const useCertificateTypeManagement = () => {
  const [onEditCertificateType, setOnEditCertificateType] = useState<UpdateCertificateTypeSelected>(
    {
      selectedCertificateType: null,
      clearSelectedCertificateType: () => {
        setOnEditCertificateType((prev) => ({ ...prev, selectedCertificateType: null }));
      },
    }
  );
  const { currentPage, searchQuery, handlePageChange, handleSearch } = usePagination();
  const { handleActivateCertificateTypeMutation, handleDeleteCertificateTypeMutation } =
    useCertificateTypes({
      currentPage,
      searchQuery,
    });

  //Controlo estado del CertificateType seleccionado en la lista
  const handleStateCertificateType = (data: CertificateTypeResponse) => {
    setOnEditCertificateType((prev) => ({ ...prev, selectedCertificateType: data }));
  };

  // Eventos de seleccion de botones por fila
  const handleEditCertificateTypeInRow = useCallback((data: CertificateTypeResponse) => {
    if (!data) return;
    handleStateCertificateType(data);
  }, []);

  const handleDeleteCertificateTypeInRow = useCallback(
    async (data: CertificateTypeResponse) => {
      if (!data?.certificateTypeId) return;
      handleStateCertificateType(data);
      await handleDeleteCertificateTypeMutation.mutateAsync({
        certificateTypeId: data.certificateTypeId,
      });
    },
    [handleDeleteCertificateTypeMutation]
  );

  const handleActivateCertificateTypeInRow = useCallback(
    async (data: CertificateTypeResponse) => {
      if (!data?.certificateTypeId) return;

      handleStateCertificateType(data);
      await handleActivateCertificateTypeMutation.mutateAsync({
        certificateTypeId: data.certificateTypeId,
      });
    },
    [handleActivateCertificateTypeMutation]
  );

  return {
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    onEditCertificateType,
    handleStateCertificateType,
    handleEditCertificateTypeInRow,
    handleDeleteCertificateTypeInRow,
    handleActivateCertificateTypeInRow,
  };
};
