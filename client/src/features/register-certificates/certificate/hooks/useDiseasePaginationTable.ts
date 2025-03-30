import { usePagination } from "../../../../shared/hooks/usePagination";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";

export const useDiseasePaginationTable = ({
  selectedConfirmDiseases,
}: {
  selectedConfirmDiseases: Array<DiseaseResponse>;
}) => {
  // Control de tabla principal dentro del formulario
  const { currentPage: diseaseCurrentPage, handlePageChange: handleDiseasePageChange } =
    usePagination();
  const startIndex = (diseaseCurrentPage - 1) * LIMIT_PAGE;
  const endIndex = startIndex + LIMIT_PAGE;
  const paginatedDiseases = selectedConfirmDiseases.slice(startIndex, endIndex);

  return {
    diseaseCurrentPage,
    handleDiseasePageChange,
    paginatedDiseases,
  };
};
