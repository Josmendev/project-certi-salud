import { useNavigate } from "react-router";
import { Card } from "../../../../shared/components/Card/Card";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";

export const UserListPage = () => {
  const navigate = useNavigate();
  const headersTable = ["ID", "Trabajador", "Usuario", "Rol", "Confirmado", "Estado"];

  const users = [
    {
      id: 1,
      staff: "Fernando Jesus Menacho Minchola",
      username: "12345678",
      role: "Administrador",
      isConfirm: true,
      isActive: false,
    },
    {
      id: 2,
      staff: "Jose Armando Menacho Minchola",
      username: "12345678",
      role: "Registrador",
      isConfirm: false,
      isActive: true,
    },
  ];

  const handleEditRow = (idRow: number) => {
    const ADMIN = BASE_ROUTES.PRIVATE.ADMIN;
    const USERS = ADMIN_USERS_ROUTES.USERS;
    const ROUTE = `/${ADMIN}/${USERS}/${idRow}/edit`;
    console.log("Edit row with id:", idRow);
    navigate(ROUTE);
  };

  return (
    <DefaultLayout>
      <SectionLayout title="Usuarios" subtitle="Administración de usuarios">
        <Card headerCard="Listado" footerCard={<Pagination />}>
          <Search id="txtSearchUser" name="txtSearchUser" placeholder="Buscar usuario" />
          <Table headersTable={headersTable} data={users} editRow={handleEditRow} />
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
