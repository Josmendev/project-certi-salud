import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import Loader from "../../../../shared/components/Loader";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { transformToCapitalize } from "../../../../shared/helpers/transformToCapitalize";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { getMessageConfigResponse } from "../../../../shared/utils/getMessageConfig";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { showToast } from "../../../../shared/utils/toast";
import { useCertificateTypes } from "../hooks/useCertificateTypes";
import { getCertificateTypeSchema } from "../schemas/getCertificateTypeSchema";
import type {
  CertificateTypeResponse,
  UpdateCertificateTypeSelected,
} from "../types/CertificateType";

export const UpsertCertificateTypeForm = ({
  onEditCertificateType,
}: {
  onEditCertificateType: UpdateCertificateTypeSelected;
}) => {
  const { selectedCertificateType, clearSelectedCertificateType } = onEditCertificateType;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CertificateTypeResponse>({
    resolver: zodResolver(getCertificateTypeSchema()),
    mode: "onChange", // Valido cuando el usuario escribe
  });

  const { currentPage, searchQuery } = usePagination();
  const { handleCreateCertificateTypeMutation, handleUpdateCertificateTypeMutation } =
    useCertificateTypes({
      currentPage,
      searchQuery,
    });

  //Asigno el valor de descripcion al campo del register
  useEffect(() => {
    if (selectedCertificateType) setValue("description", selectedCertificateType.description);
    else reset();
  }, [selectedCertificateType, setValue, reset]);

  const onSubmit: SubmitHandler<CertificateTypeResponse> = async (data) => {
    try {
      const typeCertificateToCapitalize = transformToCapitalize(data?.description);

      // Update
      if (selectedCertificateType) {
        await handleUpdateCertificateTypeMutation.mutateAsync({
          certificateType: { description: typeCertificateToCapitalize },
          certificateTypeId: selectedCertificateType.certificateTypeId,
        });

        const messageToast = getMessageConfigResponse("Tipo de certificado");
        showToast({ ...messageToast.update });
        setFocus("description");
        // Create
      } else {
        await handleCreateCertificateTypeMutation.mutateAsync({
          certificateType: { description: typeCertificateToCapitalize },
        });

        const messageToast = getMessageConfigResponse("Tipo de certificado");
        showToast({ ...messageToast.create });
        setFocus("description");
      }

      onReset();
    } catch (error) {
      handleApiError(error);
    }
  };

  const onReset = () => {
    reset();
    setFocus("description");
    clearSelectedCertificateType();
  };

  return (
    <>
      {(handleUpdateCertificateTypeMutation.isPending ||
        handleCreateCertificateTypeMutation.isPending) && <Loader />}

      <form className="form-certificateType" onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Descripción"
          type="text"
          placeholder="Ingresa el tipo de certificado"
          required
          autoFocus
          tabIndex={1}
          aria-label="Campo para ingresar el tipo de certificado"
          {...register("description")}
          error={errors.description?.message as string}
        />

        <div className="flex gap-4 mt-8">
          <Button
            title={`${!selectedCertificateType ? "Agregar" : "Actualizar"}`}
            type="submit"
            tabIndex={2}
            classButton={`btn-primary text-paragraph-regular ${
              !selectedCertificateType ? "" : "bg-warning-400 hover:bg-warning-500"
            }`}
            iconLeft={
              !selectedCertificateType ? (
                <Icon.Save size={28} strokeWidth={1.2} />
              ) : (
                <Icon.Edit size={28} strokeWidth={1.2} />
              )
            }
            disabled={isSubmitting || !!errors.description}
          >
            <span>{`${!selectedCertificateType ? "Agregar" : "Actualizar"}`}</span>
          </Button>

          <Button
            title={`${!selectedCertificateType ? "Limpiar" : "Cancelar"}`}
            type="button"
            tabIndex={3}
            classButton={`btn-primary text-paragraph-regular ${
              !selectedCertificateType
                ? "bg-neutral-600 hover:bg-neutral-700"
                : "bg-error-500 hover:bg-error-600"
            }`}
            iconLeft={
              !selectedCertificateType ? (
                <Icon.Clear size={28} strokeWidth={1.2} />
              ) : (
                <Icon.Close size={28} strokeWidth={1.2} />
              )
            }
            onClick={onReset}
            disabled={isSubmitting}
          >
            <span>
              <span>{`${!selectedCertificateType ? "Limpiar" : "Cancelar"}`}</span>
            </span>
          </Button>
        </div>
      </form>
    </>
  );
};
