import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { Role } from "../types/Role";
import type { ResponseRole } from "../types/roleTypes";

export interface TableRoleItemProps {
  listOfRoles: Array<ResponseRole>;
  editRow?: (data: Role) => void;
  deleteRow?: (data: Role) => void;
  activateRow?: (data: Role) => void;
  currentPage: number;
}

export const TableRoleItem: React.FC<TableRoleItemProps> = ({
  listOfRoles,
  editRow,
  deleteRow,
  activateRow,
  currentPage,
}) => {
  const stateDefault = "text-paragraph-s-medium inline-block w-12 py-1 rounded-lg";
  const stateClassSuccess = `text-success-600 bg-success-50 ${stateDefault}`;
  const stateClassDanger = `text-danger-600 bg-danger-50 ${stateDefault}`;
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
      {listOfRoles.map((row, rowIndex) => (
        <tr key={row?.roleId} className="border-b border-neutral-100 text-center">
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row?.description}</td>
          <td className="p-2">{textIsActive(row?.isActive)}</td>
          <td className="p-3 w-[180px] flex gap-1.5 items-center justify-center">
            {editRow && (
              <Button
                title="Editar"
                id={`btnEditRow-${row?.roleId}`}
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
                id={`btnDeleteRow-${row?.roleId}`}
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
                id={`btnactivateRow-${row?.roleId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-success-500"
                onClick={() => activateRow(row)}
              >
                <Icon.Active className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
