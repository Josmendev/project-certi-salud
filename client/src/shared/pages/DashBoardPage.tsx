import DefaultLayout from "../layouts/DefaultLayout";
import { SectionLayout } from "../layouts/SectionLayout";

export const DashBoardPage: React.FC = () => {
  return (
    <DefaultLayout>
      <SectionLayout title="Inicio" subtitle="Bienvenido">
        <h3 className="text-h3-semibold">Bienvenido Fernando Minchola 👋👋👋</h3>
      </SectionLayout>
    </DefaultLayout>
  );
};
