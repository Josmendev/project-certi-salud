import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Navigate, useLocation } from "react-router";
import { Button } from "../../../../shared/components/Button/Button";
import { GenericModal } from "../../../../shared/components/GenericModal";
import { Icon } from "../../../../shared/components/Icon";
import { Spinner } from "../../../../shared/components/Spinner/Spinner";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { transformToCapitalize } from "../../../../shared/helpers/transformToCapitalize";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { getMessageConfigResponse } from "../../../../shared/utils/getMessageConfig";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { showToast } from "../../../../shared/utils/toast";
import { usePatient } from "../hooks/usePatient";
import { usePatientManagement } from "../hooks/usePatientManagement";
import { getPatientSchema } from "../schemas/PatientSchema";
import type { Patient, PatientResponse, PatientResponseConditional } from "../types/Patient";

export const UpsertPatientForm = () => {
  const location = useLocation();
  const selectedPatient: PatientResponse = location.state?.patient;
  const { currentPage, searchQuery } = usePagination();
  const getAgeRef = useRef<number>();
  const { shouldRedirect } = usePatientManagement();

  const {
    handleCreatePatientMutation,
    handleUpdatePatientMutation,
    handleAssignPatientMutation,
    handleActivatePatientMutation,
    MAIN_ROUTE,
  } = usePatient({ currentPage, searchQuery });
  const { modalType, openModal, closeModal, selectedItem } = useModalManager<
    Patient | PatientResponseConditional
  >();

  const ROUTE_INITIAL = `${MAIN_ROUTE}?page=${currentPage}`;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<Patient>({
    resolver: zodResolver(getPatientSchema()),
    mode: "onChange", // Valido cuando el usuario escribe
  });

  useEffect(() => {
    if (selectedPatient) {
      const { identityDocumentNumber, name, paternalSurname, maternalSurname } =
        selectedPatient.person;

      setValue("identityDocumentNumber", identityDocumentNumber ?? "");
      setValue("name", name ?? "");
      setValue("paternalSurname", paternalSurname ?? "");
      setValue("maternalSurname", maternalSurname ?? "");
      setValue("age", selectedPatient.age ?? 0);
      setFocus("identityDocumentNumber");
    }
  }, [selectedPatient, setValue, setFocus]);

  //Validacion para redireccionar si digitan en la URL un ID pero no hay datos
  if (!selectedPatient && !shouldRedirect && !location.pathname.includes("add")) {
    showToast({
      title: "Selección de personal inválido",
      description: "Debes seleccionar un personal previamente",
      type: "error",
    });
    return <Navigate to={ROUTE_INITIAL} />;
  }

  const onErrorMessageInPatient = ({ message }: { message: string }) => {
    showToast({
      title: "Error",
      description: `${message}`,
      type: "error",
    });
  };

  const onReset = () => {
    reset();
    setFocus("identityDocumentNumber");
  };

  const onSubmit: SubmitHandler<Patient> = async (data) => {
    const { identityDocumentNumber, name, paternalSurname, maternalSurname, age } = data;
    try {
      // Update
      const upsertPatient = {
        identityDocumentNumber: identityDocumentNumber ?? "",
        name: transformToCapitalize(name ?? ""),
        paternalSurname: transformToCapitalize(paternalSurname ?? ""),
        maternalSurname: transformToCapitalize(maternalSurname ?? ""),
        age,
      };

      if (selectedPatient) {
        const updatePatient = upsertPatient;

        await handleUpdatePatientMutation.mutateAsync({
          patient: updatePatient,
          patientId: selectedPatient.patientId,
        });

        const messageToast = getMessageConfigResponse("Paciente");
        showToast({ ...messageToast.update });

        return;
      }

      // Create
      const response = await handleCreatePatientMutation.mutateAsync({ patient: upsertPatient });

      if ("isStaffToAssignPacient" in response) {
        getAgeRef.current = data.age;
        openModal("assign", response);
        return;
      }

      if ("isPatientDesactivated" in response) {
        openModal("activate", response);
        return;
      }

      if ("isRegistered" in response) {
        return onErrorMessageInPatient({
          message: `El paciente con el DNI ${response.DNI} ya se encuentra registrado`,
        });
      }

      const messageToast = getMessageConfigResponse("Paciente");
      showToast({ ...messageToast.create });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mb-5 pl-8">
          <TextInput
            label="DNI"
            type="text"
            minLength={2}
            maxLength={100}
            ariaLabel="Documento nacional de identidad"
            placeholder="Ingrese su DNI"
            tabIndex={1}
            {...register("identityDocumentNumber")}
            error={errors.identityDocumentNumber?.message as string}
          />

          <TextInput
            label="Nombres"
            type="text"
            maxLength={25}
            ariaLabel="Nombres"
            placeholder="Ingrese sus nombres completos"
            tabIndex={2}
            {...register("name")}
            error={errors.name?.message as string}
          />
        </div>

        <div className="flex flex-col gap-5 mb-5 pr-8">
          <TextInput
            label="Apellido Paterno"
            type="text"
            maxLength={50}
            ariaLabel="Apellido Paterno"
            placeholder="Ingrese su Apellido Paterno"
            tabIndex={3}
            {...register("paternalSurname")}
            error={errors.paternalSurname?.message as string}
          />

          <TextInput
            label="Apellido Materno"
            type="text"
            maxLength={50}
            ariaLabel="Apellido Materno"
            placeholder="Ingrese su Apellido Materno"
            tabIndex={4}
            {...register("maternalSurname")}
            error={errors.maternalSurname?.message as string}
          />
        </div>

        <div className="col-span-2 mb-5 pl-8 pr-8">
          <TextInput
            label="Edad"
            type="number"
            classTextInput="pr-4"
            min={0}
            max={120}
            ariaLabel="Edad del paciente"
            placeholder="Ingrese la Edad"
            tabIndex={5}
            {...register("age", { valueAsNumber: true })}
            error={errors.age?.message as string}
          />
        </div>

        <div className="user-buttons mt-5 flex gap-20 col-span-2 px-4">
          <Button
            title={selectedPatient ? "Actualizar" : "Guardar"}
            id="btnUpsertPatient"
            type="submit"
            classButton="btn-primary text-paragraph-medium"
            iconLeft={
              (
                selectedPatient
                  ? handleUpdatePatientMutation.isPending
                  : handleCreatePatientMutation.isPending
              ) ? (
                <Spinner className="mr-1" />
              ) : (
                <Icon.Save size={28} strokeWidth={1.2} />
              )
            }
            disabled={
              handleUpdatePatientMutation.isPending ||
              handleCreatePatientMutation.isPending ||
              Object.keys(errors).length > 0
            }
          >
            <span>{handleCreatePatientMutation.isPending ? "Guardando..." : "Guardar"}</span>
          </Button>

          <Button
            title="Limpiar registros"
            id="btnClearFieldsOfPatient"
            type="button"
            classButton="btn-primary text-paragraph-medium bg-neutral-600 hover:bg-neutral-700"
            iconLeft={<Icon.Clear size={28} strokeWidth={1.2} />}
            disabled={
              handleUpdatePatientMutation.isPending || handleCreatePatientMutation.isPending
            }
            onClick={onReset}
          >
            Limpiar campos
          </Button>
        </div>
      </form>

      <GenericModal
        modalType={modalType}
        onClose={closeModal}
        isLoadingData={
          modalType === "activate"
            ? handleActivatePatientMutation.isPending
            : handleAssignPatientMutation.isPending
        }
        entitiesInMessage={["Personal", "Paciente"]}
        onConfirm={async () => {
          if (!selectedItem)
            return onErrorMessageInPatient({ message: "No hay datos del paciente" });

          if (modalType === "assign" && "DNI" in selectedItem && getAgeRef.current) {
            await handleAssignPatientMutation.mutateAsync({
              patient: { identityDocumentNumber: selectedItem.DNI, age: getAgeRef.current },
            });
            const messageToast = getMessageConfigResponse("Paciente", ["Personal", "Paciente"]);
            showToast({ ...messageToast.assign });
          }

          if (modalType === "activate" && "patientId" in selectedItem && selectedItem.patientId) {
            await handleActivatePatientMutation.mutateAsync({ patientId: selectedItem.patientId });
            const messageToast = getMessageConfigResponse("Paciente");
            showToast({ ...messageToast.activate, permanent: true });
          }
        }}
        entityName="Paciente"
      />
    </>
  );
};
