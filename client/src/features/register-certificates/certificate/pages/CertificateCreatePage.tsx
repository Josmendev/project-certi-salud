import { Card } from "../../../../shared/components/Card/Card";
import DefaultLayout from "../../../../shared/layouts/DefaultLayout";
import { SectionLayout } from "../../../../shared/layouts/SectionLayout";
import { CreateCertificateForm } from "../components/CreateCertificateForm";

export const CertificateCreatePage = () => {
  return (
    <DefaultLayout>
      <SectionLayout title="Certificados médicos" subtitle="Registro de certificados">
        <Card headerCard="Registro">
          <CreateCertificateForm />
        </Card>
      </SectionLayout>
    </DefaultLayout>
  );
};
