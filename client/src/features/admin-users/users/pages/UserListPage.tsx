import { Card } from "../../../../shared/components/Card/Card";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { TableUserItem } from "../components/TableUserItem";
import { useUsers } from "../hooks/useUsers";

export const UserListPage = () => {
  const {
    data,
    currentPage,
    isLoading,
    isError,
    error,
    handleEditRow,
    handlePageChange,
    handleSearch,
  } = useUsers();

  const headersTable = ["ID", "Trabajador", "Usuario", "Rol", "Confirmado", "Estado"];

  return (
    <DefaultLayout>
      <SectionLayout title="Usuarios" subtitle="Administración de usuarios">
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
            id="txtSearchUser"
            name="txtSearchUser"
            placeholder="Buscar usuario"
            onSearch={handleSearch}
          />

          {isLoading && <Loader />}
          {isError && <b>Error: {error?.message || "Error desconocido"}</b>}

          {
            <Table headersTable={headersTable} response={data}>
              <TableUserItem listOfUsers={data?.data ?? []} editRow={handleEditRow} />
            </Table>
          }
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
