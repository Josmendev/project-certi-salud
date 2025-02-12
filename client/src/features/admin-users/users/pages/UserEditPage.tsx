import { useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { Checkbox } from "../../../../shared/components/Checkbox/Checkbox";
import { Icon } from "../../../../shared/components/Icon";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { BASE_ROUTES } from "../../../../shared/utils/constants";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";

//📌 => Orden convencional para estructura de componentes
export const UserEditPage = () => {
  // 📌 Hooks
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 📌 Estado
  const [modalOpen, setModalOpen] = useState(false);

  // 📌 Variables y rutas
  const ROUTE_INITIAL = `/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}`;

  // 📌 Validaciones antes del renderizado
  // Verifico que la URL sea "/admin/users/:id/edit"
  if (location.pathname != `/admin/users/${id}/edit`) {
    return <Navigate to={ROUTE_INITIAL} replace />;
  }

  // Verifico que sea número
  if (isNaN(Number(id))) return <Navigate to={ROUTE_INITIAL} replace />;

  // 📌 Handlers de eventos
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update user");
    navigate(ROUTE_INITIAL, { replace: true });
  };

  // Abro el modal
  const openModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  // Confirmo la acción en el modal
  const handleResetPasswordUser = () => {
    console.log("Reset password user");
    setModalOpen(false);
  };

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
              onClick={() => navigate(-1)}
            >
              Regresar
            </Button>
          }
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-32" method="post">
            <div className="max-w-[580px] flex flex-col gap-5 mb-5">
              <TextInput
                label="Personal / Trabajador"
                name="staff-fullName"
                id="staff-fullName"
                type="text"
                readOnly
                value="Manuel Diaz"
                minLength={2}
                maxLength={100}
                ariaLabel="Nombres completos"
              />

              <TextInput
                label="Username"
                name="user-username"
                id="user-username"
                type="text"
                readOnly
                value="76455435"
                minLength={8}
                maxLength={8}
                ariaLabel="Documento nacional de identidad"
              />
            </div>

            <div className="roles-container text-left text-shades-dark">
              <p className="mb-2.5">Roles</p>
              <div className="roles-list flex flex-col gap-1.5">
                <Checkbox id="role-1" labelText="Administrador" />
                <Checkbox id="role-2" labelText="Registrador" />
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
