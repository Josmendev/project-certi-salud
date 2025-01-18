import { Button } from "../../../shared/components/UI/Button";
import { TextInput } from "../../../shared/components/UI/TextInput";
import { AuthLayout } from "../../../shared/layouts/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Bienvenido"
      subtitle="Ingresa tus credenciales para iniciar sesión"
    >
      <div className="container-inputs flex flex-col gap-5">
        <TextInput
          label="Nombre de usuario"
          name="txtusername"
          id="txtusername"
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          required
          tabIndex={1}
          maxLength={8}
          autoFocus
          iconRight={
            <img
              src="/user.svg"
              alt="User icon"
              width={28}
              height={28}
            />
          }
          aria-label="Campo para ingresar el nombre de usuario"
        />
        <TextInput
          label="Contraseña"
          name="txtpassword"
          id="txtpassword"
          type="password"
          placeholder="Ingresa tu contraseña"
          classTextInputParent="mb-[42px]"
          required
          tabIndex={2}
          minLength={4}
          maxLength={50}
          iconRight={
            <img
              src="/password.svg"
              alt="Password Icons"
              width={28}
              height={28}
            />
          }
          aria-label="Campo para ingresar la contraseña"
        />
      </div>

      <Button
        name="btnSignIn"
        id="btnSignIn"
        title="Iniciar sesión"
        type="submit"
        tabIndex={3}
        iconRight={
          <img
            src="/arrow-bar-right.svg"
            alt="Icono de flecha"
            width={24}
            height={24}
            className="invert"
          />
        }
      >
        <span>Iniciar sesión</span>
      </Button>
    </AuthLayout>
  );
};
