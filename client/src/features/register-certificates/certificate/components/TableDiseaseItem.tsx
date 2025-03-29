import { Checkbox } from "../../../../shared/components/Checkbox/Checkbox";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";

export interface TableDiseaseItemProps {
  listOfDisease: Array<DiseaseResponse>;
  currentPage: number;
  selectedDiseases?: Array<DiseaseResponse>; // Estado manejado en el padre
  handleCheckboxChange?: (disease: DiseaseResponse) => void; // cambio estado
  isTableInModal?: boolean;
}

export const TableDiseaseItem: React.FC<TableDiseaseItemProps> = ({
  listOfDisease,
  currentPage,
  selectedDiseases,
  handleCheckboxChange,
  isTableInModal = false,
}) => {
  const rowsPerPage = LIMIT_PAGE; // Límite de registros por página
  const startIndex = (currentPage - 1) * rowsPerPage; // Índice de inicio según la página

  return (
    <>
      {listOfDisease.map((row, rowIndex) => (
        <tr key={row?.diseaseId} className="border-b border-neutral-100 text-center">
          {isTableInModal && (
            <td className="p-2">
              <Checkbox
                id={row.diseaseId.toString()}
                checked={
                  selectedDiseases &&
                  selectedDiseases.some((disease) => disease.diseaseId === row.diseaseId)
                }
                onChange={() => handleCheckboxChange?.(row)}
              />
            </td>
          )}
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row?.cie10}</td>
          <td className="p-2">{row?.description}</td>
        </tr>
      ))}
    </>
  );
};
