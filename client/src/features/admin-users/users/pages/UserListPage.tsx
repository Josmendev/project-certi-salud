import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../../../shared/components/Card/Card";
import Loader from "../../../../shared/components/Loader";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import type { DataResponseFromAPI } from "../../../../shared/types/DataResponse";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { TableUserItem } from "../components/TableUserItem";
import { getUsers } from "../helpers/getUsers";
import type { DataOfUsers } from "../types/userTypes";
import { initialStateUsers } from "../utils/constants";

export const UserListPage = () => {
  const navigate = useNavigate();
  // Creo el estado de usuarios y tomo como generico de data del backend a DataOfUsers
  const [users, setUsers] = useState<DataResponseFromAPI<DataOfUsers>>(initialStateUsers);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(users.page);

  const { data: listOfUsers, page, totalPages } = users;
  const headersTable = ["ID", "Trabajador", "Usuario", "Rol", "Confirmado", "Estado"];

  const handleEditRow = (idRow: number) => {
    const ADMIN = BASE_ROUTES.PRIVATE.ADMIN;
    const USERS = ADMIN_USERS_ROUTES.USERS;
    const ROUTE = `/${ADMIN}/${USERS}/${idRow}/edit`;
    navigate(ROUTE);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const allUsers = await getUsers({ page: currentPage });
      if ("data" in allUsers) setUsers(allUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DefaultLayout>
      <SectionLayout title="Usuarios" subtitle="Administración de usuarios">
        <Card
          headerCard="Listado"
          footerCard={
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          }
        >
          <Search id="txtSearchUser" name="txtSearchUser" placeholder="Buscar usuario" />
          {loading ? (
            <Loader />
          ) : (
            <Table headersTable={headersTable} response={users}>
              <TableUserItem listOfUsers={listOfUsers} editRow={handleEditRow} />
            </Table>
          )}
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
