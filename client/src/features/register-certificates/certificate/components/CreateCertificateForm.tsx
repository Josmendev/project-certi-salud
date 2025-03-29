import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { Icon } from "../../../../shared/components/Icon";
import Loader from "../../../../shared/components/Loader";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";
import { Search } from "../../../../shared/components/Search";
import SelectGroup from "../../../../shared/components/SelectGroup/SelectGroup";
import { Table } from "../../../../shared/components/Table/Table";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";
import { transformToCapitalize } from "../../../../shared/helpers/transformToCapitalize";
import { useModalManager } from "../../../../shared/hooks/useModalManager";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { LIMIT_PAGE } from "../../../../shared/utils/constants";
import { getCurrentDate } from "../../../../shared/utils/getCurrentDate";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { showToast } from "../../../../shared/utils/toast";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";
import type { CertificateTypeResponse } from "../../type-certificate/types/CertificateType";
import { isValidDni } from "../helpers/validateDni";
import { useDiseaseCertificate } from "../hooks/useDiseaseCertificate";
import { useTypeCertificate } from "../hooks/useTypeCertificate";
import { generateCodeCertificate, getPersonByDni } from "../repositories/certificateRepository";
import { getCertificateSchema } from "../schemas/CertificateSchema";
import type { Certificate, PersonByDniResponse } from "../types/Certificate";
import { TableDiseaseItem } from "./TableDiseaseItem";

export const CreateCertificateForm = () => {
  const [generateCodeForCertificate, setGenerateCodeForCertificate] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<CertificateTypeResponse | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dniRef = useRef<boolean>(false);
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseResponse[]>([]); // Estado para checkbox
  const [selectedConfirmDiseases, setSelectedConfirmDiseases] = useState<DiseaseResponse[]>([]); // Estado para tabla

  // Valores de la tabla
  const headersTableModal = ["Estado", "N°", "CIE 10", "Nombre"];
  const headersTable = ["N°", "CIE 10", "Nombre"];

  const { currentPage: diseaseCurrentPage, handlePageChange: handleDiseasePageChange } =
    usePagination();
  const startIndex = (diseaseCurrentPage - 1) * LIMIT_PAGE;
  const endIndex = startIndex + LIMIT_PAGE;
  const paginatedDiseases = selectedConfirmDiseases.slice(startIndex, endIndex);

  // Paginación del Modal y servicio externo para consumo de la tabla
  const { currentPage, searchQuery, handlePageChange, handleSearch, clearPageParam } =
    usePagination({
      pageURL: "modalPage",
    });
  const { modalType, openModal, closeModal } = useModalManager();
  const { dataOfDiseases, isLoadingDiseases, isErrorDisease, errorDisease } = useDiseaseCertificate(
    { currentPage, searchQuery }
  );

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
    if (!selectedOption) {
      showToast({
        title: "Tipo de certificado",
        description: "Debes seleccionar una opción en tipo de certificado",
        type: "error",
      });
      return;
    }

    console.log(data);
    console.log("OPTION SELECTED -> ID", selectedOption.certificateTypeId);
    // Desactivo el readonly para el DNI
    dniRef.current = false;
  };

  const onReset = () => {
    setFocus("identityDocumentNumber");
    reset();
    dniRef.current = false;
    setSelectedDiseases([]);
    setSelectedConfirmDiseases([]);
    setSelectedOption(undefined);
  };

  // Genero funcion de proc. almacenado para los certificados (valores unicos)
  const fetchCodeForCertificate = async () => {
    try {
      setIsLoading(true);
      const code = await generateCodeCertificate();
      setGenerateCodeForCertificate(code);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Genero busqueda de dni por persona de la BD
  const SearchPersonByDni = async ({ dni }: { dni: string }) => {
    if (!isValidDni(dni)) return;

    try {
      setIsLoading(true);
      const response = await getPersonByDni({ dni });

      if ("message" in response) {
        showToast({
          title: "Registro de DNI",
          description: "Debes ingresar un DNI válido",
          type: "error",
        });

        onResetDni();
        return;
      }

      // Si no hay error, extraemos los datos
      const { identityDocumentNumber, name, maternalSurname, paternalSurname } =
        response as PersonByDniResponse;

      setValue("identityDocumentNumber", identityDocumentNumber);
      setValue("name", transformToCapitalize(name));
      setValue("maternalSurname", transformToCapitalize(maternalSurname));
      setValue("paternalSurname", transformToCapitalize(paternalSurname));
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchPersonByDni = () => {
    const dniValue = watch("identityDocumentNumber");
    SearchPersonByDni({ dni: dniValue });
    dniRef.current = true;
  };

  const onResetDni = useCallback(() => {
    setFocus("identityDocumentNumber");
    resetField("identityDocumentNumber");
    dniRef.current = false;
  }, [resetField, setFocus]);

  const handleCheckboxChange = (disease: DiseaseResponse) => {
    setSelectedDiseases(
      (prev) =>
        prev.some((d) => d.diseaseId === disease.diseaseId)
          ? prev.filter((d) => d.diseaseId !== disease.diseaseId) // Deseleccionar
          : [...prev, disease] // Seleccionar
    );
  };

  useEffect(() => {
    fetchCodeForCertificate();
    onResetDni();
  }, [onResetDni]);

  if (isLoadingDiseases || isLoadingOfTypeCertificate) return <Loader />;
  if (isErrorDisease) {
    return <b>Error: {errorDisease?.message || "Error al cargar enfermedades"}</b>;
  }

  if (isErrorOfTypeCertificate) {
    return (
      <b>Error: {errorOfTypeCertificate?.message || "Error al cargar tipo de certificados"}</b>
    );
  }

  if (!dataOfDiseases || !dataOfTypeCertificate) return;

  return (
    <>
      {isLoading && <Loader />}
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
              title="Buscar por DNI"
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
            selectedOption={selectedOption}
            onChange={setSelectedOption}
          />

          {selectedOption?.description === "Descanso Médico" && (
            <TextInput
              label="Días de descanso"
              type="number"
              ariaLabel="Días de descanso por paciente"
              placeholder="Ingrese los días de descanso"
              tabIndex={8}
              {...register("restDays", { valueAsNumber: true })}
              error={errors.restDays?.message as string}
            />
          )}
        </div>

        {/* Diagnostico Section */}
        {selectedOption?.description === "Descanso Médico" && (
          <div>
            <div className="flex justify-between gap-4 items-center">
              <h4 className="text-paragraph-semibold">Diagnóstico</h4>
              <Button
                title="Añadir enfermedad"
                id="btnSearchDiseases"
                type="button"
                classButton="btn-primary text-paragraph-medium w-max py-2.5"
                iconLeft={<Icon.Save size={28} strokeWidth={1.2} />}
                onClick={() => {
                  openModal("tableData");
                  clearPageParam();
                }}
              >
                <span>Añadir enfermedad</span>
              </Button>
            </div>

            <div>
              <Card
                headerCard="Listado"
                classCardName="min-h-max"
                footerCard={
                  <Pagination
                    currentPage={diseaseCurrentPage}
                    totalPages={Math.ceil(selectedConfirmDiseases.length / LIMIT_PAGE) || 1}
                    onPageChange={handleDiseasePageChange}
                  />
                }
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
              </Card>
            </div>
          </div>
        )}

        {/* Buttons Section */}
        <div className="flex gap-20 mt-5">
          <Button
            title="Guardar"
            id="btnSaveCertificate"
            type="submit"
            classButton="btn-primary text-paragraph-medium"
            iconLeft={<Icon.Save size={28} strokeWidth={1.2} />}
            disabled={Object.keys(errors).length > 0}
          >
            <span>Guardar</span>
          </Button>

          <Button
            title="Limpiar registros"
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
        title="Listado de Enfermedades según CIE 10"
        isOpen={!!modalType}
        onClose={() => {
          // Mantengo los datos de la tabla general seleccionados en el Modal
          setSelectedDiseases(selectedConfirmDiseases);
          clearPageParam();
          closeModal();
        }}
        onClickSuccess={() => {
          setSelectedConfirmDiseases(selectedDiseases);
          clearPageParam();
          closeModal();
        }}
      >
        <Card
          headerCard="Listado"
          className="my-8"
          footerCard={
            <Pagination
              currentPage={currentPage}
              totalPages={dataOfDiseases.totalPages || 1}
              onPageChange={handlePageChange}
            />
          }
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
              handleCheckboxChange={handleCheckboxChange}
              isTableInModal
            />
          </Table>
        </Card>
      </Modal>
    </>
  );
};
