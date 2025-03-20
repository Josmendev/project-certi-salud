import { Card } from "../../../../shared/components/Card/Card";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import { usePagination } from "../../../../shared/hooks/usePagination";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { TableDiseaseItem } from "../components/TableDiseaseItem";
import { useDisease } from "../hooks/useDisease";

export const DiseaseListPage = () => {
  const { currentPage, searchQuery, handlePageChange, handleSearch } = usePagination();

  const { data, isLoading, isError, error } = useDisease({
    currentPage,
    searchQuery,
  });

  const headersTable = ["N°", "CIE-10", "Descripción", "Estado"];

  if (isLoading) return <Loader />;
  if (isError) return <b>Error: {error?.message || "Error desconocido"}</b>;

  return (
    <DefaultLayout>
      <SectionLayout title="Enfermedad" subtitle="Información Requerida">
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
            id="txtSearchDisease"
            name="txtSearchDisease"
            placeholder="Buscar Enfermedad"
            onSearch={handleSearch}
          />

          <Table headersTable={headersTable} response={data} hasButtonActions={false}>
            <TableDiseaseItem listOfDisease={data?.data ?? []} currentPage={currentPage} />
          </Table>
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
