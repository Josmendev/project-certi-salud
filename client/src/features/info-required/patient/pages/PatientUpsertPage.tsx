import { useNavigate } from "react-router";
import { Button } from "../../../../shared/components/Button/Button";
import { Card } from "../../../../shared/components/Card/Card";
import { Icon } from "../../../../shared/components/Icon";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { UpsertPatientForm } from "../components/UpsertPatientForm";
import { usePatientManagement } from "../hooks/usePatientManagement";

//📌 => Orden convencional para estructura de componentes
export const PatientUpsertPage = () => {
  const { currentPage, MAIN_ROUTE } = usePatientManagement();

  const navigate = useNavigate();
  const ROUTE_INITIAL = `${MAIN_ROUTE}?page=${currentPage || 1}`;

  return (
    <DefaultLayout>
      <SectionLayout title="Paciente" subtitle="Información Requerida">
        <Card
          headerCard="Registro"
          headerRightContentCard={
            <Button
              id="btnBack-upsertPatient"
              title="Regresar"
              classButton="btn-primary w-auto text-paragraph-regular py-2"
              type="button"
              iconLeft={<Icon.Back />}
              onClick={() => navigate(ROUTE_INITIAL)}
            >
              Regresar
            </Button>
          }
        >
          <UpsertPatientForm />
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
