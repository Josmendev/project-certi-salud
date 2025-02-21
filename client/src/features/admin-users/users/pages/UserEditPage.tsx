import { useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { Checkbox } from "../../../../shared/components/Checkbox/Checkbox";
import { Icon } from "../../../../shared/components/Icon";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { getUserDetail } from "../../../../shared/helpers/getUserInformation";
import { showToast } from "../../../../shared/hooks/useToast";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { BASE_ROUTES, ROLES_MAPPING, type ROLES_KEYS } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { useUsers } from "../hooks/useUsers";
import type { DataOfUser } from "../types/userTypes";

//📌 => Orden convencional para estructura de componentes
export const UserEditPage = () => {
  // 📌 Hooks
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedUser = location.state?.user as DataOfUser;
  const currentPage = location.state?.page as number;
  const { handleUpdateUserMutation, handleResetPasswordUserMutation } = useUsers();

  // 📌 Estado
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<ROLES_KEYS[]>((selectedUser?.role as ROLES_KEYS[]) || []);

  // 📌 Variables y rutas
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}?page=${currentPage}`;

  // 📌 Validaciones antes del renderizado
  if (id == undefined || isNaN(Number(id))) {
    return <Navigate to={ROUTE_INITIAL} />;
  }

  if (location.pathname !== `/admin/users/${id}/edit`) {
    return <Navigate to={ROUTE_INITIAL} />;
  }

  // 📌 Handlers de eventos
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const rolesId = roles?.map((role) => ROLES_MAPPING[role]).filter(Number.isFinite);

    handleUpdateUserMutation.mutate({
      userId: selectedUser?.userId,
      role: rolesId,
    });

    showToast({
      title: "Usuario actualiizado",
      description: "Los datos del usuario han sido actualizados con éxito!",
      type: "success",
    });

    navigate(ROUTE_INITIAL);
  };

  const handleChangeRole = (role: ROLES_KEYS) => {
    setRoles(
      (prevRoles) =>
        prevRoles.includes(role)
          ? prevRoles.filter((r) => r !== role) // Remueve el rol si ya está
          : [...prevRoles, role] // Agrega el rol si no está
    );
  };

  // Confirmo la acción en el modal
  const handleResetPasswordUser = () => {
    handleResetPasswordUserMutation.mutate({
      userId: selectedUser?.userId,
    });

    showToast({
      title: "Contraseña restablecida",
      description:
        "Se restableció la contraseña de manera exitosa. Para iniciar sesión, el usuario debe confirmar sus credenciales.",
      type: "success",
    });

    setModalOpen(false);
    navigate(ROUTE_INITIAL);
  };

  // Abro el modal
  const openModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  // funcion para roles

  // 📌 Retorno de JSX
  return (
    <DefaultLayout>
      <SectionLayout title="Usuarios" subtitle="Administración de usuarios">
        <Card
          headerCard="Registro"
          btnBack={
            <Button
              id="btnBack-editUser"
              title="Regresar"
              classButton="btn-primary w-auto text-paragraph-regular py-2"
              type="button"
              iconLeft={<Icon.Back />}
              onClick={() => navigate(ROUTE_INITIAL, { replace: true })}
            >
              Regresar
            </Button>
          }
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-32" method="post">
            <div className="max-w-[580px] flex flex-col gap-5 mb-5">
              <TextInput
                label="Personal / Trabajador"
                type="text"
                readOnly
                value={getUserDetail(selectedUser).userInformation}
                minLength={2}
                maxLength={100}
                ariaLabel="Nombres completos"
              />

              <TextInput
                label="Username"
                type="text"
                readOnly
                value={selectedUser.username}
                minLength={8}
                maxLength={8}
                ariaLabel="Documento nacional de identidad"
              />
            </div>

            <div className="roles-container text-left text-shades-dark">
              <p className="mb-2.5">Roles</p>
              <div className="roles-list flex flex-col gap-1.5">
                <Checkbox
                  id="role-1"
                  labelText="Administrador"
                  checked={roles.includes("Administrador")}
                  onChange={() => handleChangeRole("Administrador")}
                />
                <Checkbox
                  id="role-2"
                  labelText="Registrador"
                  checked={roles.includes("Registrador")}
                  onChange={() => handleChangeRole("Registrador")}
                />
              </div>
            </div>

            <div className="user-buttons mt-5 flex gap-20 col-span-2">
              <Button
                title="Guardar"
                id="btnSaveUser"
                type="submit"
                classButton="btn-primary text-paragraph-medium"
                iconLeft={<Icon.Save />}
                onClick={handleUpdateUser}
              >
                Guardar
              </Button>

              <Button
                title="Refrescar contraseña"
                id="btnResetUser"
                type="submit"
                classButton="btn-primary text-paragraph-medium bg-neutral-600 hover:bg-neutral-700"
                iconLeft={<Icon.Refresh />}
                onClick={openModal}
              >
                Refrescar contraseña
              </Button>
            </div>
          </form>

          <Modal
            title="Refrescar contraseña"
            subtitle="¿Desea cambiar la contraseña?"
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onClickSuccess={() => handleResetPasswordUser()}
          />
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
