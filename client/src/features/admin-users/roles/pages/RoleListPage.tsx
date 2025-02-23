import { useState } from "react";
import { Card } from "../../../../shared/components/Card/Card";
import Loader from "../../../../shared/components/Loader";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import { Table } from "../../../../shared/components/Table/Table";
import { useModal } from "../../../../shared/hooks/useModal";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { TableRoleItem } from "../components/TableRoleItem";
import { UpsertRoleForm } from "../components/UpsertRoleForm";
import { useRoles } from "../hooks/useRoles";
import type { Role } from "../types/Role";
import type { UpdateSelectedRole } from "../types/roleTypes";

export const RoleListPage = () => {
  const [onEditRole, setOnEditRoleRole] = useState<UpdateSelectedRole>({
    selectedRole: null,
    clearSelectedRole: () => {
      setOnEditRoleRole((prev) => ({ ...prev, selectedRole: null }));
    },
  });
  const { modalType, openModal, closeModal } = useModal();

  const headersTable = ["N°", "Rol", "Estado"];
  const {
    data,
    isLoading,
    isError,
    error,
    currentPage,
    handlePageChangeInRole,
    handleSearchRole,
    handleActivateRoleMutation,
    handleDeleteRoleMutation,
  } = useRoles();

  const handleEditRoleInRow = (data: Role) => {
    setOnEditRoleRole((prev) => ({ ...prev, selectedRole: data }));
  };

  const handleDeleteRoleInRow = (data: Role) => {
    handleDeleteRoleMutation.mutate({ roleId: data.roleId });
  };

  const handleActivateRoleInRow = (data: Role) => {
    console.log("Falta implementar en el back");
    handleActivateRoleMutation.mutate({ roleId: data.roleId });
  };

  return (
    <DefaultLayout>
      <SectionLayout
        title="Roles"
        subtitle="Administración de usuarios"
        classNameForChildren="flex gap-4"
      >
        <Card headerCard="Registro" className="min-w-96">
          <UpsertRoleForm onEditRole={onEditRole} />
        </Card>

        {isLoading && <Loader />}
        {isError && <b>Error: {error?.message || "Error desconocido"}</b>}

        <Card
          headerCard="Listado"
          className="flex-auto items-center"
          headerRightContentCard={
            <Search
              id="txtSearchRole"
              name="txtSearchRole"
              placeholder="Buscar rol"
              className="!mt-0 !mb-0"
              onSearch={handleSearchRole}
            />
          }
          footerCard={
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages ?? 1}
              onPageChange={handlePageChangeInRole}
            />
          }
        >
          <Table headersTable={headersTable} response={data}>
            <TableRoleItem
              listOfRoles={data?.data ?? []}
              currentPage={currentPage}
              editRow={handleEditRoleInRow}
              deleteRow={() => openModal("delete")}
              activateRow={() => openModal("activate")}
            />
          </Table>
        </Card>

        <Modal
          title="Eliminar Rol"
          subtitle="¿Deseas eliminar el rol seleccionado?"
          isOpen={modalType === "delete"}
          onClose={closeModal}
          onClickSuccess={() => handleDeleteRoleInRow}
        />

        <Modal
          title="Activar Rol"
          subtitle="¿Deseas activar el rol seleccionado?"
          isOpen={modalType === "activate"}
          onClose={closeModal}
          onClickSuccess={() => handleActivateRoleInRow}
        />
      </SectionLayout>
    </DefaultLayout>
  );
};
