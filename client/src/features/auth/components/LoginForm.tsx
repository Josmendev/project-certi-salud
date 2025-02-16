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
import { getLoginSchema } from "../schemas/LoginSchema";
import type { AuthLoginUser } from "../types/authTypes";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { loading, login, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginUser>({
    resolver: zodResolver(getLoginSchema(user?.isConfirm ?? false)),
    mode: "onChange", // Valido cuando el usuario escribe
  });

  const onSubmit: SubmitHandler<AuthLoginUser> = async (data) => {
    // Luego validar con el backend
    const userData = await login(data);
    if (isErrorResponse(userData)) {
      return showToast({
        type: "error",
        title: "Error en el login",
        description: "No se pudo iniciar sesión",
      });
    }

    const { token, isConfirm } = userData;

    if (!isConfirm) {
      showToast({
        title: "Confirmación de cuenta",
        description: "Ahora debes confirmar tu cuenta",
        type: "info",
      });
      navigate("/" + BASE_ROUTES.PUBLIC.CONFIRM_ACCOUNT);
      return;
    }

    if (token && token.length > 0 && isConfirm) {
      showToast({
        title: "Inicio de sesión",
        description: "Has iniciado sesión satisfactoriamente",
        type: "success",
      });
      navigate("/" + BASE_ROUTES.PRIVATE.DASHBOARD);
      return;
    }
  };

  return (
    <>
      {loading && <Loader />}
      <form className="container-inputs flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Nombre de usuario"
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          required
          autoFocus
          maxLength={8}
          tabIndex={1}
          inputMode="numeric" // En phone, se activa modo numerico
          iconRight={<Icon.User size={28} strokeWidth={1} />}
          aria-label="Campo para ingresar el nombre de usuario"
          {...register("username")}
          error={errors.username?.message as string}
        />
        <TextInput
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          required
          tabIndex={2}
          iconRight={<Icon.Password size={28} strokeWidth={1} />}
          aria-label="Campo para ingresar la contraseña"
          {...register("password")}
          error={errors.password?.message as string}
        />

        <Button
          name="btnSignIn"
          title="Iniciar sesión"
          type="submit"
          tabIndex={3}
          classButton="btn-primary mt-4"
          iconRight={<Icon.ArrowRight size={28} />}
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <span>Iniciar sesión</span>
        </Button>
      </form>
    </>
  );
};
