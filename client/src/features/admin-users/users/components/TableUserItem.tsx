import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { DataOfUser } from "../types/userTypes";

export interface TableUserItemProps {
  listOfUsers: Array<DataOfUser>;
  currentPage: number;
  editRow?: (data: DataOfUser) => void;
}

export const TableUserItem: React.FC<TableUserItemProps> = ({
  listOfUsers,
  editRow,
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

  const textIsConfirm = (rowConfirm: boolean) =>
    rowConfirm ? textDataStatus("OK", stateClassSuccess) : textDataStatus("NO", stateClassDanger);

  const textIsActive = (rowActive: boolean) =>
    rowActive
      ? textDataStatus("Activo", stateClassSuccess + " w-[74px]")
      : textDataStatus("Inactivo", stateClassDanger + " w-[74px]");

  return (
    <>
      {listOfUsers.map((row, rowIndex) => (
        <tr key={row?.userId} className="border-b border-neutral-100 text-center">
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row.username}</td>
          <td className="p-2">
            {row.person.name} {row.person.paternalSurname} {row.person.maternalSurname}
          </td>
          <td className="p-2">{row.role.join(", ")}</td>
          <td className="p-2">{textIsConfirm(row.isConfirm)}</td>
          <td className="p-2">{textIsActive(row.isActive)}</td>
          <td className="p-3 w-[180px] flex gap-1.5 items-center justify-center">
            {editRow && (
              <Button
                title="Editar"
                id={`btnEditRow-${row.userId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-warning-400"
                onClick={() => editRow(row)}
              >
                <Icon.Edit className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
