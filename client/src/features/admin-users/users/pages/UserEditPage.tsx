import { Navigate, useNavigate } from "react-router";
import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { Checkbox } from "../../../../shared/components/Checkbox/Checkbox";
import { Icon } from "../../../../shared/components/Icon";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { getUserInformation } from "../../../../shared/helpers/getUserInformation";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { useUserManagement } from "../hooks/useUserManagement";

//📌 => Orden convencional para estructura de componentes
export const UserEditPage = () => {
  const {
    selectedUser,
    modalOpen,
    roles,
    currentPage,
    setModalOpen,
    handleUpdateUser,
    handleChangeRole,
    handleResetPasswordUser,
    openModal,
    shouldRedirect,
    MAIN_ROUTE,
  } = useUserManagement();

  const navigate = useNavigate();
  const ROUTE_INITIAL = `${MAIN_ROUTE}?page=${currentPage}`;
  if (!selectedUser || !roles) return <Navigate to={ROUTE_INITIAL} />;
  if (shouldRedirect) return <Navigate to={ROUTE_INITIAL} />;

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
                value={getUserInformation(selectedUser).userInformation}
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
                onClick={(e) => {
                  handleUpdateUser(e);
                  navigate(ROUTE_INITIAL);
                }}
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
            subtitle="¿Desea restaurar la contraseña a su estado inicial?"
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onClickSuccess={() => {
              handleResetPasswordUser();
              navigate(ROUTE_INITIAL);
            }}
          />
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
