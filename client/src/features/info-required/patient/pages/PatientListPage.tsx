import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { GenericModal } from "../../../../shared/components/GenericModal";
import { Icon } from "../../../../shared/components/Icon";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { TablePatientItem } from "../components/TablePatientItem";
import { usePatient } from "../hooks/usePatient";
import { usePatientManagement } from "../hooks/usePatientManagement";
import type { PatientResponse } from "../types/Patient";

export const PatientListPage = () => {
  const {
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    handleDeletePatientInRow,
    handleUpdatePatientInRow,
    handleCreatePatient,
  } = usePatientManagement();

  const { data, isLoading, isError, error } = usePatient({
    currentPage,
    searchQuery,
  });
  const { modalType, selectedItem, openModal, closeModal } = useModalManager<PatientResponse>();
  const headersTable = ["N°", "DNI", "Nombres", "Apellidos", "Edad", "Estado"];

  if (isLoading) return <Loader />;
  if (isError) return <b>Error: {error?.message || "Error desconocido"}</b>;

  return (
    <DefaultLayout>
      <SectionLayout title="Paciente" subtitle="Información Requerida">
        <Card
          headerCard="Listado"
          headerRightContentCard={
            <Button
              id="btnEditPatient"
              title="Nuevo"
              classButton="btn-primary w-auto text-paragraph-regular py-2"
              type="button"
              iconLeft={<Icon.Plus />}
              onClick={handleCreatePatient}
            >
              Nuevo
            </Button>
          }
          footerCard={
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 1}
              onPageChange={handlePageChange}
            />
          }
        >
          <Search
            id="txtSearchPatient"
            name="txtSearchPatient"
            placeholder="Buscar Paciente"
            onSearch={handleSearch}
          />

          <Table headersTable={headersTable} response={data}>
            <TablePatientItem
              listOfPatient={data?.data ?? []}
              currentPage={currentPage}
              editRow={(data: PatientResponse) => handleUpdatePatientInRow(data)}
              deleteRow={(data: PatientResponse) => openModal("delete", data)}
            />
          </Table>
        </Card>

        <GenericModal
          modalType={modalType}
          onClose={closeModal}
          onConfirm={() => {
            if (selectedItem) {
              if (modalType === "delete") handleDeletePatientInRow(selectedItem);
            }
          }}
          entityName="Paciente"
        />
      </SectionLayout>
    </DefaultLayout>
  );
};
