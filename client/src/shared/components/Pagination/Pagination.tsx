import { Button } from "../Button/Button";
import { Icon } from "../Icon";

interface Props {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  classPagination?: string;
  classPage?: string;
  classPageActive?: string;
  classPageDisabled?: string;
}

export const Pagination: React.FC<Props> = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
  classPage = "",
  classPageActive = "",
  classPageDisabled = "",
}) => {
  const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  return (
    <div className="flex items-center justify-between bg-shades-light px-6 pb-4">
      <p>
        Mostrando {currentPage} de {totalPages} páginas
      </p>

      <nav className="flex items-center gap-2">
        {/* Botón Anterior */}
        <Button
          title="Anterior"
          id="btnPagination-prev"
          aria-label="Página anterior"
          classButton={`cursor-pointer ${classPage} ${isFirstPage ? classPageDisabled : ""}`}
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon.Chevron className="text-shades-dark p-1.5 transform rotate-90" size={32} />
        </Button>

        {/* Números de Página */}
        {pages.map((page) => (
          <Button
            key={page}
            title={`Página ${page}`}
            id={`btnPagination-${page}`}
            classButton={`text-shades-dark text-paragraph-semibold cursor-pointer ${classPage} ${
              page === currentPage ? classPageActive : ""
            }`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </Button>
        ))}

        {/* Botón Siguiente */}
        <Button
          title="Siguiente"
          id="btnPagination-next"
          aria-label="Página siguiente"
          classButton={`cursor-pointer ${classPage} ${isLastPage ? classPageDisabled : ""}`}
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon.Chevron className="text-shades-dark p-1.5 transform -rotate-90" size={32} />
        </Button>
      </nav>
    </div>
  );
};
