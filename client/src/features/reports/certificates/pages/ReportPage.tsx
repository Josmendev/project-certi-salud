import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { GenericModal } from "../../../../shared/components/GenericModal";
import { Image } from "../../../../shared/components/Image";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import { usePagination } from "../../../../shared/hooks/usePagination";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { getMessageConfigResponse } from "../../../../shared/utils/getMessageConfig";
import { showToast } from "../../../../shared/utils/toast";
import type { CertificateResponse } from "../../../register-certificates/certificate/types/Certificate";
import { TableCertificateItem } from "../components/TableCertificateItem";
import { useReportCertificate } from "../hooks/useReportCertificate";
import { useReportCertificateManagement } from "../hooks/useReportCertificateManagement";

export const ReportPage = () => {
  const { currentPage, searchQuery, handlePageChange, handleSearch } = usePagination();
  const { modalType, selectedItem, openModal, closeModal } = useModalManager<CertificateResponse>();
  const { data, isLoading, isError, error } = useReportCertificate({ currentPage, searchQuery });
  const {
    handleDeleteCertificateInRow,
    handleGenerateCertificateInPdf,
    handleGenerateCertificateByIdInPdf,
    isLoadingAllCertificates,
    isLoadingByIdCertificate,
  } = useReportCertificateManagement();

  const headersTable = [
    "N°",
    "Código",
    "Fecha",
    "Tipo",
    "Responsable",
    "DNI",
    "Nombres completos",
    "Edad",
    "Descanso",
  ];
  const groupHeadersTable = [
    {
      title: "Datos del Certificado",
      colSpan: 5,
    },
    {
      title: "Datos del paciente",
      colSpan: 5,
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <b>Error: {error?.message || "Error desconocido"}</b>;

  return (
    <DefaultLayout>
      {(isLoadingAllCertificates || isLoadingByIdCertificate) && (
        <Loader content="Generando PDF..." />
      )}

      <SectionLayout title="Reporte" subtitle="Administración de reportes">
        <Button
          title="Generar pdf"
          id="btn-generatePdf"
          classButton="btn-primary transition-all duration-200 ease-in-out bg-red-500 hover:bg-red-600 max-w-max mb-4"
          iconLeft={<Image src="/logo-pdf.png" alt="Logo PDF" width={28} height={28} />}
          onClick={async () => {
            await handleGenerateCertificateInPdf();
            const messageToast = getMessageConfigResponse("Certificado");
            showToast({ ...messageToast.reportCertificate });
          }}
        >
          <span>Generar PDF</span>
        </Button>

        <Card
          headerCard="Listado"
          footerCard={
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 1}
              onPageChange={handlePageChange}
            />
          }
        >
          <Search
            id="txtSearchCertificate"
            name="txtSearchCertificate"
            placeholder="Buscar Certificado (solo por código)"
            className="w-[420px]"
            onSearch={handleSearch}
          />

          <Table headersTable={headersTable} response={data} groupHeadersTable={groupHeadersTable}>
            <TableCertificateItem
              listOfCertificate={data?.data ?? []}
              currentPage={currentPage}
              deleteRow={(data: CertificateResponse) => openModal("delete", data)}
              viewRow={async (data: CertificateResponse) => {
                await handleGenerateCertificateByIdInPdf({ reportId: data.certificateId });
                const messageToast = getMessageConfigResponse("Certificado Asignado");
                showToast({ ...messageToast.reportCertificate });
              }}
            />
          </Table>
        </Card>

        <GenericModal
          modalType={modalType}
          onClose={closeModal}
          onConfirm={() => {
            if (selectedItem) {
              if (modalType === "delete") handleDeleteCertificateInRow(selectedItem);
            }
          }}
          entityName="Reporte de Certificado"
        />
      </SectionLayout>
    </DefaultLayout>
  );
};
