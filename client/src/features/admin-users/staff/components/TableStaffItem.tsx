import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import type { Person } from "../../../../shared/types/Person";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { StaffResponse } from "../types/Staff";

export interface TableStaffItemProps {
  listOfStaff: Array<StaffResponse>;
  editRow?: (data: StaffResponse) => void;
  deleteRow?: (data: StaffResponse) => void;
  activateRow?: (data: StaffResponse) => void;
  assignRow?: (data: StaffResponse) => void;
  currentPage: number;
}

export const TableStaffItem: React.FC<TableStaffItemProps> = ({
  listOfStaff,
  editRow,
  deleteRow,
  activateRow,
  assignRow,
  currentPage,
}) => {
  const stateDefault = "text-paragraph-s-medium inline-block w-12 py-1 rounded-lg";
  const stateClassSuccess = `text-success-600 bg-success-50 ${stateDefault}`;
  const stateClassDanger = `text-error-600 bg-error-50 ${stateDefault}`;
  const rowsPerPage = LIMIT_PAGE; // Límite de registros por página
  const startIndex = (currentPage - 1) * rowsPerPage; // Índice de inicio según la página

  const getLastName = (person: Person) => {
    const { maternalSurname, paternalSurname } = person;
    return `${paternalSurname} ${maternalSurname}`;
  };

  const textDataStatus = (textContent: string, stateClass: string) => (
    <span className={stateClass}>{textContent}</span>
  );

  const textIsActive = (rowActive?: boolean) =>
    rowActive
      ? textDataStatus("Activo", stateClassSuccess + " w-[74px]")
      : textDataStatus("Inactivo", stateClassDanger + " w-[74px]");

  return (
    <>
      {listOfStaff.map((row, rowIndex) => (
        <tr key={row?.staffId} className="border-b border-neutral-100 text-center">
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row?.person?.identityDocumentNumber}</td>
          <td className="p-2">{row?.person?.name}</td>
          <td className="p-2">{getLastName(row?.person)}</td>
          <td className="p-2">{textIsActive(row?.isActive)}</td>
          <td className="p-3 w-[180px] flex gap-1.5 items-center justify-center">
            {editRow && (
              <Button
                title="Editar"
                id={`btnEditRow-${row?.staffId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-warning-500"
                onClick={() => editRow(row)}
              >
                <Icon.Edit className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}

            {row.isActive && deleteRow && (
              <Button
                title="Eliminar"
                id={`btnDeleteRow-${row?.staffId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-red-600"
                onClick={() => deleteRow(row)}
              >
                <Icon.Trash className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}

            {!row.isActive && activateRow && (
              <Button
                title="Activar"
                id={`btnactivateRow-${row?.staffId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-success-500"
                onClick={() => activateRow(row)}
              >
                <Icon.Active className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}

            {row.isActive && assignRow && (
              <Button
                title="Asignar como paciente"
                id={`btnAssignRow-${row?.staffId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-primary-700"
                onClick={() => assignRow(row)}
              >
                <Icon.AssignPacient className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
