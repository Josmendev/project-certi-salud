import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../../shared/components/Button/Button";
import { Icon } from "../../../shared/components/Icon";
import Loader from "../../../shared/components/Loader";
import { TextInput } from "../../../shared/components/TextInput/TextInput";
import { AuthContext } from "../../../shared/contexts/AuthContext";
import { showToast } from "../../../shared/hooks/useToast";
import { BASE_ROUTES } from "../../../shared/utils/constants";
import { isErrorResponse } from "../../../shared/utils/iSErrorResponse";
import { ConfirmUserSchema } from "../schemas/ConfirmUserSchema";
import type { AuthConfirmUser } from "../types/authTypes";

export const ConfirmUserForm = () => {
  const navigate = useNavigate();
  const { loading, confirmUser, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthConfirmUser>({
    resolver: zodResolver(ConfirmUserSchema),
    mode: "onChange", // Valido cuando el usuario escribe
  });

  const onSubmit: SubmitHandler<AuthConfirmUser> = async (data) => {
    // Luego validar con el backend
    const userData = await confirmUser(data);
    if (isErrorResponse(userData)) {
      showToast({
        type: "error",
        title: "Error en confirmación",
        description: "No se pudo confirmar el usuario",
      });
      return;
    }

    navigate("/" + BASE_ROUTES.PRIVATE.DASHBOARD);
  };

  return (
    <>
      {loading && <Loader />}
      <form className="container-inputs flex flex-col gap-5">
        <TextInput
          label="Nombre de usuario"
          type="text"
          readOnly
          maxLength={8}
          value={user?.username || "00000000"}
          iconRight={<Icon.User size={28} strokeWidth={1} />}
          aria-label="Campo para ingresar el nombre de usuario"
        />
        <TextInput
          label="Nueva Contraseña"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          required
          tabIndex={1}
          maxLength={50}
          autoFocus
          iconRight={<Icon.Password size={28} strokeWidth={1} />}
          aria-label="Campo para ingresar la nueva contraseña"
          {...register("newPassword")}
          error={errors.newPassword?.message as string}
        />
        <TextInput
          label="Repetir Contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          required
          tabIndex={2}
          maxLength={50}
          iconRight={<Icon.Password size={28} strokeWidth={1} />}
          aria-label="Campo para repetir tu contrasena nuevamente"
          {...register("repeatPassword")}
          error={errors.repeatPassword?.message as string}
        />
      </form>

      <Button
        name="btnConfirmUser"
        id="btnConfirmUser"
        title="Confirmar cuenta"
        type="submit"
        tabIndex={3}
        classButton="btn-primary mt-7"
        iconRight={
          <Icon.Check
            size={24}
            className="transition duration-300 ease-in-out group-hover:translate-x-2"
          />
        }
        onClick={handleSubmit(onSubmit)}
      >
        <span>Confirmar cuenta</span>
      </Button>
    </>
  );
};
