import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ValidationParamsInUpdate } from "../../../../shared/helpers/ValidationParamsInUpdate";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { BASE_ROUTES, ROLES_MAPPING, type ROLES_KEYS } from "../../../../shared/utils/constants";
import { getMessageConfigResponse } from "../../../../shared/utils/getMessageConfig";
import { showToast } from "../../../../shared/utils/toast";
import type { User } from "../../../auth/types/User";
import { ADMIN_USERS_ROUTES } from "../../utils/constants";
import { useUsers } from "./useUsers";

export const useUserManagement = () => {
  // 📌 Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPage: pageOfPagination, searchQuery } = usePagination();
  const selectedUser = location.state?.user as User;
  const currentPage = (location.state?.pageOfUsers as number) ?? pageOfPagination ?? 1;
  const MAIN_ROUTE = `/${BASE_ROUTES.PRIVATE.ADMIN}/${ADMIN_USERS_ROUTES.USERS}`;
  const { handleUpdateUserMutation, handleResetPasswordUserMutation } = useUsers({
    currentPage,
    searchQuery,
  });

  // 📌 Estados
  const [roles, setRoles] = useState<ROLES_KEYS[]>((selectedUser?.role as ROLES_KEYS[]) || []);

  // 📌 Validaciones antes del renderizado (edit)
  const isUpdating = location.pathname.includes("/edit");
  if (isUpdating) {
    const isValidateParams = ValidationParamsInUpdate(MAIN_ROUTE);
    if (!isValidateParams) return { shouldRedirect: true };
  }

  // Eventos al seleccionar fila
  const onEditRowSelected = (data: User) => {
    navigate(`${MAIN_ROUTE}/${data.userId}/edit`, {
      state: { user: data, pageOfUsers: pageOfPagination },
    });
  };

  // Handlers de eventos generales
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const rolesId = roles?.map((role) => ROLES_MAPPING[role]).filter(Number.isFinite);

    if (rolesId.length === 0) {
      showToast({
        title: "No hay roles seleccionados",
        description: `Tiene que seleccionar un rol como mínimo`,
        type: "error",
      });
      return false;
    }

    handleUpdateUserMutation.mutate({
      userId: selectedUser?.userId,
      role: rolesId,
    });

    const messageToast = getMessageConfigResponse("Usuario", ["update"]);
    showToast({ ...messageToast.update });
    return true;
  };

  // Confirmo la acción en el modal
  const handleResetPasswordUser = () => {
    handleResetPasswordUserMutation.mutate({
      userId: selectedUser?.userId,
    });

    const messageToast = getMessageConfigResponse("Personal", ["refreshPassword"]);
    showToast({ ...messageToast.refreshPassword });
  };

  const handleChangeRole = (role: ROLES_KEYS) => {
    setRoles(
      (prevRoles) =>
        prevRoles.includes(role)
          ? prevRoles.filter((r) => r !== role) // Remueve el rol si ya está
          : [...prevRoles, role] // Agrega el rol si no está
    );
  };

  return {
    selectedUser,
    currentPage,
    roles,
    onEditRowSelected,
    handleUpdateUser,
    handleChangeRole,
    handleResetPasswordUser,
    shouldRedirect: false,
    MAIN_ROUTE,
  };
};
