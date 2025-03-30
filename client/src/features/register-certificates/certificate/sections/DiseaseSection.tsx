import { Card } from "../../../../shared/components/Card/Card";
import { Pagination } from "../../../../shared/components/Pagination/Pagination";

interface Props {
  currentPage: number;
  handleDiseasePageChange: (page: number) => void;
  totalPages: number;
  classCardName?: string;
  className?: string;
  children?: React.ReactNode;
}
export const DiseaseSection: React.FC<Props> = ({
  currentPage,
  handleDiseasePageChange,
  className = "",
  classCardName = "",
  children,
  totalPages,
}) => {
  return (
    <div>
      <Card
        headerCard="Listado"
        className={className}
        classCardName={classCardName}
        footerCard={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={handleDiseasePageChange}
          />
        }
      >
        {/* Seccion para el boton de search (si es necesario) */}
        {children && children}
      </Card>
    </div>
  );
};
