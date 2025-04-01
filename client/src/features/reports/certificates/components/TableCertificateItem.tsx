import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import type { CertificateResponse } from "../../../register-certificates/certificate/types/Certificate";

export interface TableCertificateItemProps {
  listOfCertificate: Array<CertificateResponse>;
  viewRow?: (data: CertificateResponse) => void;
  deleteRow?: (data: CertificateResponse) => void;
  currentPage: number;
}

export const TableCertificateItem: React.FC<TableCertificateItemProps> = ({
  listOfCertificate,
  viewRow,
  deleteRow,
  currentPage,
}) => {
  const rowsPerPage = LIMIT_PAGE; // Límite de registros por página
  const startIndex = (currentPage - 1) * rowsPerPage; // Índice de inicio según la página

  return (
    <>
      {listOfCertificate.map((row, rowIndex) => (
        <tr key={row?.certificateId} className="border-b border-neutral-100 text-center">
          <td className="p-2">{startIndex + rowIndex + 1}</td>
          <td className="p-2">{row?.certificateCode}</td>
          <td className="p-2">{row?.issueDate.toString()}</td>
          <td className="p-2">{row?.certificateTypeDescription}</td>
          <td className="p-2">{row?.staffName}</td>
          <td className="p-2">{row?.patientDni}</td>
          <td className="p-2">{row?.patientName}</td>
          <td className="p-2">{row?.patientAge}</td>
          <td className="p-2">{row?.restDays}</td>
          <td className="p-3 w-[180px] flex gap-1.5 items-center justify-center">
            {viewRow && (
              <Button
                title="Ver certificado"
                id={`btnViewRow-${row?.certificateId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-warning-500"
                onClick={() => viewRow(row)}
              >
                <Icon.Certificate className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}

            {deleteRow && (
              <Button
                title="Eliminar"
                id={`btnDeleteRow-${row?.certificateId}`}
                aria-data={row}
                classButton="transition-all duration-200 ease-in-out hover:text-warning-500"
                onClick={() => deleteRow(row)}
              >
                <Icon.Trash className="w-6 h-6" strokeWidth={1.2} />
              </Button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};
