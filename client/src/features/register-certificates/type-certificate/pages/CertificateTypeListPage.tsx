import { Card } from "../../../../shared/components/Card/Card";
import { GenericModal } from "../../../../shared/components/GenericModal";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { TableCertificateTypeItem } from "../components/TableTypeCertificateItem";
import { UpsertCertificateTypeForm } from "../components/UpsertCertificateTypeForm";
import { useCertificateTypeManagement } from "../hooks/useCertificateTypeManagement";
import { useCertificateTypes } from "../hooks/useCertificateTypes";
import type { CertificateTypeResponse } from "../types/CertificateType";

export const CertificateTypeListPage = () => {
  const {
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    onEditCertificateType,
    handleStateCertificateType,
    handleEditCertificateTypeInRow,
    handleActivateCertificateTypeInRow,
    handleDeleteCertificateTypeInRow,
  } = useCertificateTypeManagement();

  const { data, isLoading, isError, error } = useCertificateTypes({
    currentPage,
    searchQuery,
  });

  const { modalType, openModal, closeModal, selectedItem } =
    useModalManager<CertificateTypeResponse>();
  const headersTable = ["N°", "Rol", "Estado"];

  if (isLoading) return <Loader />;
  if (isError) return <b>Error: {error?.message || "Error desconocido"}</b>;

  return (
    <DefaultLayout>
      <SectionLayout
        title="Tipo de Certificado"
        subtitle="Registro de Certificados"
        classNameForChildren="flex gap-4"
      >
        <Card headerCard="Registro" className="min-w-[460px] overflow-hidden !h-[310px]">
          <UpsertCertificateTypeForm onEditCertificateType={onEditCertificateType} />
        </Card>

        <Card
          headerCard="Listado"
          className="flex-auto items-center"
          headerRightContentCard={
            <Search
              id="txtSearchCertificateType"
              name="txtSearchCertificateType"
              placeholder="Buscar tipo de certificado"
              className="!mt-0 !mb-0"
              onSearch={handleSearch}
            />
          }
          footerCard={
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 1}
              onPageChange={handlePageChange}
              className="-mt-12"
            />
          }
        >
          <Table headersTable={headersTable} response={data}>
            <TableCertificateTypeItem
              listOfCertificateTypes={data?.data ?? []}
              currentPage={currentPage}
              editRow={handleEditCertificateTypeInRow}
              deleteRow={(data) => {
                openModal("delete", data);
                handleStateCertificateType(data);
              }}
              activateRow={(data) => {
                openModal("activate", data);
                handleStateCertificateType(data);
              }}
            />
          </Table>
        </Card>

        <GenericModal
          modalType={modalType}
          onClose={() => {
            onEditCertificateType.clearSelectedCertificateType();
            closeModal();
          }}
          onConfirm={() => {
            if (selectedItem) {
              if (modalType === "delete") handleDeleteCertificateTypeInRow(selectedItem);
              if (modalType === "activate") handleActivateCertificateTypeInRow(selectedItem);
              onEditCertificateType.clearSelectedCertificateType();
            }
          }}
          entityName="Tipo de Certificado"
        />
      </SectionLayout>
    </DefaultLayout>
  );
};
