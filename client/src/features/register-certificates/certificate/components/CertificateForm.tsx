import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import Loader from "../../../../shared/components/Loader";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { Search } from "../../../../shared/components/Search";
import SelectGroup from "../../../../shared/components/SelectGroup/SelectGroup";
import { Table } from "../../../../shared/components/Table/Table";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { transformToCapitalize } from "../../../../shared/helpers/transformToCapitalize";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { getCurrentDate } from "../../../../shared/utils/getCurrentDate";
import { getMessageConfigResponse } from "../../../../shared/utils/getMessageConfig";
import { showToast } from "../../../../shared/utils/toast";
import type { CertificateTypeResponse } from "../../type-certificate/types/CertificateType";
import { useDiseaseCertificate } from "../hooks/useDiseaseCertificate";
import { useDiseasePaginationTable } from "../hooks/useDiseasePaginationTable";
import { useDiseaseSelection } from "../hooks/useDiseaseSelection";
import { useExternalCertificateService } from "../hooks/useExternalCertificateService";
import { useTypeCertificate } from "../hooks/useTypeCertificate";
import { createCertificate } from "../repositories/certificateRepository";
import { getCertificateSchema } from "../schemas/CertificateSchema";
import { DiagnosisSection } from "../sections/DiagnosisSection";
import { DiseaseSection } from "../sections/DiseaseSection";
import type { Certificate } from "../types/Certificate";
import { STATUS_TYPE_CERTIFICATE, TEXTS_OPERATIONS } from "../utils/constants";
import { RestOfDaysInput } from "./RestOfDaysInput";
import { TableDiseaseItem } from "./TableDiseaseItem";

export const CertificateForm = () => {
  //Hook para revisar el cargado al crear un certificado
  const [isLoadingCreateCertificate, setIsLoadingCreateCertificate] = useState<boolean>(false);

  // Estado del combobox del tipo de certificado
  const [selectedOptionTypeCertificate, setSelectedOptionTypeCertificate] = useState<
    CertificateTypeResponse | undefined
  >();
  const dniRef = useRef<boolean>(false);
  // Hook para gestionar los servicios externos
  const { fetchCodeForCertificate, isLoading, generateCodeForCertificate, searchPersonByDni } =
    useExternalCertificateService();

  // Hook para controlar el toggle de diseases
  const {
    selectedDiseases,
    selectedConfirmDiseases,
    toggleCheckboxDisease,
    resetSelection,
    syncDiseasesOnClose,
    confirmSelection,
  } = useDiseaseSelection();

  // Hook para controlar la paginación de la tabla del formulario
  const { diseaseCurrentPage, handleDiseasePageChange, paginatedDiseases } =
    useDiseasePaginationTable({ selectedConfirmDiseases });

  // Encabezados de tablas (modal y principal)
  const headersTable = ["N°", "CIE 10", "Nombre"];
  const headersTableModal = ["Estado", "N°", "CIE 10", "Nombre"];

  // Paginación del Modal y servicio externo para consumo de la tabla
  const { currentPage, searchQuery, handlePageChange, handleSearch, clearPageParam } =
    usePagination({
      pageURL: "modalPage",
    });
  const { modalType, openModal, closeModal } = useModalManager();
  const { dataOfDiseases, isLoadingDiseases, isErrorDisease, errorDisease } = useDiseaseCertificate(
    { currentPage, searchQuery }
  );

  const totalPagesInFormTable = Math.ceil(selectedConfirmDiseases.length / LIMIT_PAGE);
  const isMedicalRest =
    selectedOptionTypeCertificate &&
    selectedOptionTypeCertificate.description === STATUS_TYPE_CERTIFICATE.MEDICAL_REST;

  // Obtengo los tipos de certificado
  const {
    dataOfTypeCertificate,
    isLoadingOfTypeCertificate,
    isErrorOfTypeCertificate,
    errorOfTypeCertificate,
  } = useTypeCertificate();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<Certificate>({
    resolver: zodResolver(getCertificateSchema()),
    mode: "onChange",
    defaultValues: {
      issueDate: getCurrentDate(),
      diseases: [],
    },
  });

  const onSubmit: SubmitHandler<Certificate> = async (data) => {
    if (!selectedOptionTypeCertificate) {
      showToast({
        title: "Tipo de certificado",
        description: "Debes seleccionar una opción en tipo de certificado",
        type: "error",
      });
      return;
    }

    // Validacion para la tabla de descanso medico (al menos una enfermedad como min.)
    if (isMedicalRest && selectedDiseases.length === 0) {
      showToast({
        title: "Registro de Enfermedades",
        description: "Debes añadir una enfermedad como mínimo, para el descanso médico",
        type: "error",
      });
      return;
    }

    const newCertificate: Certificate = {
      ...data,
      restDays: isMedicalRest ? data.restDays : 0,
      certificateTypeId: selectedOptionTypeCertificate.certificateTypeId,
      diseases: isMedicalRest ? selectedDiseases.map((disease) => disease.diseaseId) : [],
      issueDate: new Date(),
    };

    try {
      // Creo y desactivo el readonly para el DNI
      setIsLoadingCreateCertificate(true); // Activa el loader
      await createCertificate({ certificate: newCertificate });
      dniRef.current = false;
      const messageToast = getMessageConfigResponse("Certificado");
      showToast({ ...messageToast.create });
      onReset();
    } finally {
      setIsLoadingCreateCertificate(false); // Desactiva el loader
    }
  };

  const onReset = () => {
    onResetDni();
    reset();
    resetSelection(); // Reinicio de valores para diseases (select)
    setSelectedOptionTypeCertificate(undefined);
  };

  const handleSearchPersonByDni = async () => {
    const dniValue = watch("identityDocumentNumber");
    const personData = await searchPersonByDni({ dni: dniValue });

    if (!personData) {
      onResetDni();
      return;
    }

    setValue("identityDocumentNumber", personData.identityDocumentNumber);
    setValue("name", transformToCapitalize(personData.name) ?? "");
    setValue("maternalSurname", transformToCapitalize(personData.maternalSurname) ?? "");
    setValue("paternalSurname", transformToCapitalize(personData.paternalSurname) ?? "");
    dniRef.current = true;
  };

  const onResetDni = useCallback(() => {
    setFocus("identityDocumentNumber");
    resetField("identityDocumentNumber");
    dniRef.current = false;
  }, [resetField, setFocus]);

  useEffect(() => {
    fetchCodeForCertificate();
  }, [fetchCodeForCertificate]);

  // Validaciones antes del render
  if (isLoadingDiseases || isLoadingOfTypeCertificate) return <Loader />;
  if (isErrorDisease || isErrorOfTypeCertificate) {
    return (
      <b>
        Error: {errorDisease?.message || errorOfTypeCertificate?.message || "Error desconocido"}
      </b>
    );
  }

  if (!dataOfDiseases || !dataOfTypeCertificate) return;

  return (
    <>
      {(isLoading || isLoadingCreateCertificate) && <Loader />}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="relative">
            <TextInput
              label="DNI"
              type="text"
              minLength={2}
              maxLength={100}
              ariaLabel="Documento nacional de identidad"
              placeholder="Ingrese el DNI"
              tabIndex={1}
              readOnly={dniRef.current}
              {...register("identityDocumentNumber")}
              error={errors.identityDocumentNumber?.message as string}
            />

            <Button
              title={TEXTS_OPERATIONS.SEARCH_DNI}
              classButton={`${
                dniRef.current
                  ? "bg-neutral-100 border-neutral-100 hover:bg-none"
                  : "bg-primary-500 border-transparent hover:bg-primary-600"
              } rounded-tr-md rounded-br-md border w-12 h-12 flex justify-center items-center absolute right-0 top-[2.125rem] transition`}
              onClick={handleSearchPersonByDni}
              disabled={dniRef.current}
            >
              <Icon.Search color={dniRef.current ? "#7993bb" : "white"} strokeWidth={2} />
            </Button>
          </div>

          <TextInput
            label="Nombres"
            type="text"
            maxLength={25}
            ariaLabel="Nombres"
            placeholder="Nombres completos"
            readOnly
            tabIndex={2}
            {...register("name")}
            error={errors.name?.message as string}
          />
          <TextInput
            label="Apellido Paterno"
            type="text"
            maxLength={50}
            ariaLabel="Apellido Paterno"
            placeholder="Apellido Paterno"
            readOnly
            tabIndex={3}
            {...register("paternalSurname")}
            error={errors.paternalSurname?.message as string}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <TextInput
            label="Apellido Materno"
            type="text"
            maxLength={50}
            ariaLabel="Apellido Materno"
            placeholder="Apellido Materno"
            readOnly
            tabIndex={4}
            {...register("maternalSurname")}
            error={errors.maternalSurname?.message as string}
          />
          <TextInput
            label="Edad"
            type="number"
            min={0}
            max={120}
            ariaLabel="Edad del paciente"
            placeholder="Ingrese la Edad"
            tabIndex={5}
            {...register("age", { valueAsNumber: true })}
            error={errors.age?.message as string}
          />
          <TextInput
            label="Fecha"
            type="text"
            min={0}
            max={120}
            ariaLabel="Fecha de generación del certificado"
            placeholder="Fecha actual"
            readOnly
            {...register("issueDate")}
            tabIndex={6}
          />
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <TextInput
            label="Número de Certificado"
            type="text"
            maxLength={50}
            readOnly
            ariaLabel="Número de Certificado"
            placeholder="Ingrese su N° de Certificado"
            tabIndex={7}
            value={generateCodeForCertificate ?? ""}
          />

          <SelectGroup
            label="Tipo de Certificado"
            options={dataOfTypeCertificate}
            selectedOption={selectedOptionTypeCertificate}
            onChange={setSelectedOptionTypeCertificate}
          />

          {selectedOptionTypeCertificate?.description === "Descanso Médico" && (
            <RestOfDaysInput
              tabIndex={8}
              {...register("restDays", { valueAsNumber: true })}
              error={errors.restDays?.message as string}
            />
          )}
        </div>

        {/* Diagnostico Section */}
        {selectedOptionTypeCertificate?.description === "Descanso Médico" && (
          <DiagnosisSection openModal={openModal} clearPageParam={clearPageParam}>
            <DiseaseSection
              classCardName="min-h-max"
              currentPage={diseaseCurrentPage}
              handleDiseasePageChange={handleDiseasePageChange}
              totalPages={totalPagesInFormTable}
            >
              <Table
                headersTable={headersTable}
                response={selectedConfirmDiseases}
                hasButtonActions={false}
              >
                <TableDiseaseItem
                  listOfDisease={paginatedDiseases ?? []}
                  currentPage={diseaseCurrentPage}
                />
              </Table>
            </DiseaseSection>
          </DiagnosisSection>
        )}

        {/* Buttons Section */}
        <div className="flex gap-20 mt-5">
          <Button
            title={TEXTS_OPERATIONS.SAVE}
            id="btnSaveCertificate"
            type="submit"
            classButton="btn-primary text-paragraph-medium"
            iconLeft={<Icon.Save size={28} strokeWidth={1.2} />}
            disabled={Object.keys(errors).length > 0 || isLoadingCreateCertificate}
          >
            <span>{isLoadingCreateCertificate ? "Guardando..." : "Guardar"}</span>
          </Button>

          <Button
            title={TEXTS_OPERATIONS.CLEAR}
            id="btnClearFieldsOfPatient"
            type="button"
            classButton="btn-primary text-paragraph-medium bg-neutral-600 hover:bg-neutral-700"
            iconLeft={<Icon.Clear size={28} strokeWidth={1.2} />}
            onClick={onReset}
          >
            Limpiar campos
          </Button>
        </div>
      </form>

      <Modal
        title={TEXTS_OPERATIONS.HEADER_TITLE_MODAL}
        isOpen={!!modalType}
        onClose={() => {
          syncDiseasesOnClose(); // Restauramos la selección confirmada
          clearPageParam();
          closeModal();
        }}
        onClickSuccess={() => {
          confirmSelection(); // Confirmamos selección de enfermedades
          clearPageParam();
          closeModal();
        }}
      >
        <DiseaseSection
          currentPage={currentPage}
          handleDiseasePageChange={handlePageChange}
          totalPages={dataOfDiseases.totalPages}
          className="my-8"
        >
          <Search
            id="txtSearchDiseaseInCertificate"
            name="txtSearchDiseaseInCertificate"
            placeholder="Buscar Enfermedad"
            onSearch={handleSearch}
          />

          <Table
            headersTable={headersTableModal}
            response={dataOfDiseases ?? []}
            hasButtonActions={false}
          >
            <TableDiseaseItem
              currentPage={currentPage}
              listOfDisease={dataOfDiseases.data ?? []}
              selectedDiseases={selectedDiseases ?? []}
              handleCheckboxChange={toggleCheckboxDisease}
              isTableInModal
            />
          </Table>
        </DiseaseSection>
      </Modal>
    </>
  );
};
