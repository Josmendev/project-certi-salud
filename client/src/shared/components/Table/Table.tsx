import type { DataCollectionType } from "../../types/DataCollectionType";
import type { DataResponseFromAPI } from "../../types/DataResponse";

interface Props {
  headersTable: Array<string>;
  response: DataResponseFromAPI<DataCollectionType> | Array<DataCollectionType>;
  children: React.ReactNode;
  hasButtonActions?: boolean;
}

export const Table: React.FC<Props> = ({
  headersTable,
  response,
  hasButtonActions = true,
  children,
}) => {
  const hasData = Array.isArray(response) ? response.length > 0 : response?.data?.length > 0;

  return !hasData ? (
    <div>No hay datos para mostrar</div>
  ) : (
    <div className="overflow-x-auto bg-shades-light">
      <table className="w-full">
        <thead className="text-center bg-neutral-50">
          <tr className="border-b border-neutral-100">
            {headersTable.map((header, index) => (
              <th key={index} className="p-4 text-paragraph-semibold">
                {header}
              </th>
            ))}
            {hasButtonActions && (
              <th className="p-4 text-paragraph-semibold w-[150px]">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
