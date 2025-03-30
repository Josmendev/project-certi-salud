import { Button } from "../../../../shared/components/Button/Button";
import { Icon } from "../../../../shared/components/Icon";
import type { EventType } from "../../../../shared/types/EventType";
import { TEXTS_OPERATIONS } from "../utils/constants";

interface Props {
  openModal: (type: EventType) => void;
  clearPageParam: () => void;
  children?: React.ReactNode;
}

export const DiagnosisSection: React.FC<Props> = ({ openModal, clearPageParam, children }) => {
  return (
    <>
      <div className="flex justify-between gap-4 items-center">
        <h4 className="text-paragraph-semibold">Diagnóstico</h4>
        <Button
          title={TEXTS_OPERATIONS.ADD_DISEASE}
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
      <div>{children && children}</div>
    </>
  );
};
