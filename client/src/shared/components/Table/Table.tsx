import { Button } from "../Button/Button";
import { Icon } from "../Icon";

type ValidValueTypes = string | number | boolean | Array<string | number | boolean>;

interface Props<T extends ValidValueTypes> {
  headersTable: Array<string>;
  data: Array<Record<string, T>>;
  viewRow?: (idRow: number) => void;
  editRow?: (idRow: number) => void;
  activeRow?: (idRow: number) => void;
  deleteRow?: (idRow: number) => void;
}

export const Table = <T extends ValidValueTypes>({
  headersTable,
  data,
  viewRow,
  editRow,
  activeRow,
  deleteRow,
}: Props<T>) => {
  const headersData = data.length > 0 ? Object.keys(data[0]) : [];

  return data.length === 0 ? (
    <div>No hay datos para mostrar</div>
  ) : (
    <div className="overflow-x-auto bg-shades-light">
      <table className="w-full mb-9">
        <thead className="text-center bg-neutral-50">
          <tr className="border-b border-neutral-100">
            {headersTable.map((header, index) => (
              <th key={index} className="p-4 text-paragraph-semibold">
                {header}
              </th>
            ))}
            <th className="p-4 text-paragraph-semibold w-[150px]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowId = row.id ?? rowIndex;
            const stateDefault = "text-paragraph-s-medium px-3 py-1.5 rounded-lg";
            const stateClassSuccess = `text-success-600 bg-success-50 ${stateDefault}`;
            const stateClassDanger = `text-danger-600 bg-danger-50 ${stateDefault}`;

            const textDataStatus = (textContent: string, stateClass: string) => (
              <span className={stateClass}>{textContent}</span>
            );

            const textIsConfirm = row.isConfirm
              ? textDataStatus("OK", stateClassSuccess)
              : textDataStatus("NO", stateClassDanger);

            const textIsActive = row.isActive
              ? textDataStatus("Activo", stateClassSuccess)
              : textDataStatus("Inactivo", stateClassDanger);

            return (
              <tr key={rowId.toString()} className="border-b border-neutral-100 text-center">
                {headersData.map((header, index) => {
                  const value = row[header];
                  return (
                    <td key={`${rowId}-${index}`}>
                      {header === "isConfirm"
                        ? textIsConfirm
                        : header === "isActive"
                        ? textIsActive
                        : value}
                    </td>
                  );
                })}
                <td className="p-4 w-[220px] flex gap-1.5 items-center justify-center">
                  {viewRow && (
                    <Button
                      title="Ver"
                      id={`btnViewRow-${rowId}`}
                      aria-data={row}
                      classButton="transition-all duration-200 ease-in-out hover:text-secondary-400"
                      onClick={() => viewRow(Number(rowId))}
                    >
                      <Icon.View className="w-6 h-6" strokeWidth={1.2} />
                    </Button>
                  )}
                  {editRow && (
                    <Button
                      title="Editar"
                      id={`btnEditRow-${rowId}`}
                      aria-data={row}
                      classButton="transition-all duration-200 ease-in-out hover:text-warning-400"
                      onClick={() => editRow(Number(rowId))}
                    >
                      <Icon.Edit className="w-6 h-6" strokeWidth={1.2} />
                    </Button>
                  )}
                  {activeRow && (
                    <Button
                      title="Activar"
                      id={`btnActiveRow-${rowId}`}
                      aria-data={row}
                      classButton="transition-all duration-200 ease-in-out hover:text-success-500"
                      onClick={() => activeRow(Number(rowId))}
                    >
                      <Icon.Active className="w-6 h-6" strokeWidth={1.2} />
                    </Button>
                  )}
                  {deleteRow && (
                    <Button
                      title="Eliminar"
                      id={`btnDeleteRow-${rowId}`}
                      aria-data={row}
                      classButton="transition-all duration-200 ease-in-out hover:text-red-600"
                      onClick={() => deleteRow(Number(rowId))}
                    >
                      <Icon.Trash className="w-6 h-6" strokeWidth={1.2} />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
