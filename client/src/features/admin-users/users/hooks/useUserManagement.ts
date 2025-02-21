import { useState } from "react";
import { useLocation } from "react-router";
import { BASE_ROUTES, ROLES_MAPPING, type ROLES_KEYS } from "../../../../shared/utils/constants";
import { showToast } from "../../../../shared/utils/toast";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { ValidationParams } from "../helpers/ValidationParams";
import type { DataOfUser } from "../types/userTypes";
import { useUsers } from "./useUsers";

export const useUserManagement = () => {
  // 📌 Hooks
  const location = useLocation();
  const selectedUser = location.state?.user as DataOfUser;
  const currentPage = location.state?.page as number;
  const { handleUpdateUserMutation, handleResetPasswordUserMutation } = useUsers();

  // 📌 Estado
  const [modalOpen, setModalOpen] = useState(false);
  const [roles, setRoles] = useState<ROLES_KEYS[]>((selectedUser?.role as ROLES_KEYS[]) || []);

  // 📌 Variables y rutas con validaciones antes del renderizado
  const MAIN_ROUTE = `/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}`;
  const isValidateParams = ValidationParams(MAIN_ROUTE);
  if (!isValidateParams) return { shouldRedirect: true };

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
  };

  // Abro el modal
  const openModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return {
    selectedUser,
    currentPage,
    modalOpen,
    roles,
    setModalOpen,
    handleUpdateUser,
    handleChangeRole,
    handleResetPasswordUser,
    openModal,
    shouldRedirect: false,
    MAIN_ROUTE,
  };
};
