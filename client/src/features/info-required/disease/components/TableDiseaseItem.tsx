import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { DiseaseResponse } from "../types/Disease";

export interface TableDiseaseItemProps {
  listOfDisease: Array<DiseaseResponse>;
  currentPage: number;
}

export const TableDiseaseItem: React.FC<TableDiseaseItemProps> = ({
  listOfDisease,
  currentPage,
}) => {
  const stateDefault = "text-paragraph-s-medium inline-block w-12 py-1 rounded-lg";
  const stateClassSuccess = `text-success-600 bg-success-50 ${stateDefault}`;
  const stateClassDanger = `text-error-600 bg-error-50 ${stateDefault}`;
  const rowsPerPage = LIMIT_PAGE; // Límite de registros por página
  const startIndex = (currentPage - 1) * rowsPerPage; // Índice de inicio según la página

  const textDataStatus = (textContent: string, stateClass: string) => (
    <span className={stateClass}>{textContent}</span>
  );

  const textIsActive = (rowActive?: boolean) =>
    rowActive
      ? textDataStatus("Activo", stateClassSuccess + " w-[74px]")
      : textDataStatus("Inactivo", stateClassDanger + " w-[74px]");

  return (
    <>
      {listOfDisease.map((row, rowIndex) => (
        <tr key={row?.diseaseId} className="border-b border-neutral-100 text-center">
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row?.cie10}</td>
          <td className="p-2">{row?.description}</td>
          <td className="p-2">{textIsActive(row?.isActive)}</td>
        </tr>
      ))}
    </>
  );
};
