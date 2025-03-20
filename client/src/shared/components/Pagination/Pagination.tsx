import { Button } from "../Button/Button";
import { Icon } from "../Icon";

interface Props {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<Props> = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
  className = "",
}) => {
  const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;
  const classPageActive = "bg-primary-600 text-white text-paragraph-medium";
  const classPageDisabled = "cursor-not-allowed";

  return (
    <div className={`flex items-center justify-between bg-shades-light px-6 pb-4 ${className}`}>
      <p>
        Mostrando {currentPage} de {totalPages} páginas
      </p>

      <nav className="flex items-center gap-2">
        {/* Botón Anterior */}
        <Button
          title="Anterior"
          id="btnPagination-prev"
          aria-label="Página anterior"
          classButton={`${isFirstPage ? classPageDisabled : "cursor-pointer"}`}
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon.Chevron
            className="text-shades-dark rotate-90 hover:stroke-black hover:scale-x-110"
            size={24}
          />
        </Button>

        {/* Números de Página */}
        <div className="flex gap-2 items-center justify-center">
          {pages.map((page) => (
            <Button
              key={page}
              title={`Página ${page}`}
              classButton={`text-shades-dark text-paragraph-medium cursor-pointer rounded-lg min-w-[36px] py-2 text-center ${
                page === currentPage ? classPageActive : ""
              }`}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Botón Siguiente */}
        <Button
          title="Siguiente"
          id="btnPagination-next"
          aria-label="Página siguiente"
          classButton={`${isLastPage ? classPageDisabled : "cursor-pointer"}`}
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon.Chevron
            className="text-shades-dark transform -rotate-90 hover:stroke-black hover:scale-x-110"
            size={24}
          />
        </Button>
      </nav>
    </div>
  );
};
