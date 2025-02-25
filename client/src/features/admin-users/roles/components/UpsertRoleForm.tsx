import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { useRoles } from "../hooks/useRoles";
import { getRoleSchema } from "../schemas/RoleSchema";
import type { ResponseRole, UpdateSelectedRole } from "../types/roleTypes";

export const UpsertRoleForm = ({ onEditRole }: { onEditRole: UpdateSelectedRole }) => {
  const { selectedRole, clearSelectedRole } = onEditRole;
  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    setValue,
    formState: { errors, isLoading },
  } = useForm<ResponseRole>({
    resolver: zodResolver(getRoleSchema()),
    mode: "onChange", // Valido cuando el usuario escribe
  });

  const { handleCreateRoleMutation, handleUpdateRoleMutation } = useRoles();

  //Asigno el valor de descripcion al campo del register
  useEffect(() => {
    if (selectedRole) setValue("description", selectedRole?.description);
    else setValue("description", "");
  }, [selectedRole, setValue]);

  const onSubmit: SubmitHandler<ResponseRole> = async (data) => {
    try {
      //Edición de rol
      if (selectedRole) {
        handleUpdateRoleMutation.mutate({
          role: { description: data?.description },
          roleId: selectedRole?.roleId,
        });
        clearSelectedRole();
        onReset();
        return;
      }

      // Adición de rol
      handleCreateRoleMutation.mutate({
        role: { description: data.description },
      });

      resetField("description");
      setFocus("description");
    } catch (error) {
      handleApiError(error);
    }
  };

  const onReset = () => {
    resetField("description");
    setFocus("description");
    clearSelectedRole();
  };

  return (
    <form className="form-role" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Descripción"
        type="text"
        placeholder="Ingresa el rol"
        required
        autoFocus
        maxLength={20}
        tabIndex={1}
        aria-label="Campo para ingresar el rol"
        {...register("description")}
        error={errors.description?.message as string}
      />

      <div className="flex gap-4 mt-8">
        <Button
          title={`${!selectedRole ? "Agregar" : "Actualizar"}`}
          type="submit"
          tabIndex={2}
          classButton={`btn-primary text-paragraph-regular ${
            !selectedRole ? "" : "bg-warning-400 hover:bg-warning-500"
          }`}
          iconLeft={
            !selectedRole ? (
              <Icon.Save size={28} strokeWidth={1.2} />
            ) : (
              <Icon.Edit size={28} strokeWidth={1.2} />
            )
          }
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <span>{`${!selectedRole ? "Agregar" : "Actualizar"}`}</span>
        </Button>

        <Button
          title={`${!selectedRole ? "Limpiar" : "Cancelar"}`}
          type="button"
          tabIndex={3}
          classButton={`btn-primary text-paragraph-regular ${
            !selectedRole
              ? "bg-neutral-600 hover:bg-neutral-700"
              : "bg-error-500 hover:bg-error-600"
          }`}
          iconLeft={
            !selectedRole ? (
              <Icon.Clear size={28} strokeWidth={1.2} />
            ) : (
              <Icon.Close size={28} strokeWidth={1.2} />
            )
          }
          onClick={onReset}
          disabled={isLoading}
        >
          <span>
            <span>{`${!selectedRole ? "Limpiar" : "Cancelar"}`}</span>
          </span>
        </Button>
      </div>
    </form>
  );
};
