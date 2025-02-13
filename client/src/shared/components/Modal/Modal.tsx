import { useEffect } from "react";
import { Button } from "../Button/Button";
import ClickOutside from "../ClickOutside";

interface Props {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onClose: () => void;
  onClickSuccess: () => void;
}

export const Modal: React.FC<Props> = ({ title, subtitle, isOpen, onClose, onClickSuccess }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <ClickOutside onClick={onClose}>
        <div className="modal">
          <header className="modal-header relative">
            <h5 className="uppercase text-h5-semibold p-2">{title}</h5>
            <hr />
            <p className="text-paragraph-medium pt-5 pb-8">{subtitle}</p>
          </header>
          <div className="modal-content py-1 flex gap-4 mx-10">
            <Button
              title="Aceptar"
              classButton="btn-primary text-paragraph-medium"
              type="button"
              onClick={onClickSuccess}
            >
              ACEPTAR
            </Button>

            <Button
              title="Cancelar"
              classButton="btn-primary bg-red-500 hover:bg-red-600 text-paragraph-medium"
              type="button"
              onClick={onClose}
            >
              CANCELAR
            </Button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};
