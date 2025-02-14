import type { DataCollectionType } from "../../types/DataCollectionType";
import type { DataResponseFromAPI } from "../../types/DataResponse";

interface Props {
  headersTable: Array<string>;
  response: DataResponseFromAPI<DataCollectionType>;
  children: React.ReactNode;
}

export const Table: React.FC<Props> = ({ headersTable, response, children }) => {
  return response.data.length === 0 ? (
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
            <th className="p-4 text-paragraph-semibold w-[150px]">Acciones</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
