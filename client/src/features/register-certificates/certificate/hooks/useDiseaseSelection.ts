import { useState } from "react";
import type { DiseaseResponse } from "../../../info-required/disease/types/Disease";

export const useDiseaseSelection = () => {
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseResponse[]>([]); // Estado para checkbox
  const [selectedConfirmDiseases, setSelectedConfirmDiseases] = useState<DiseaseResponse[]>([]); // Estado para tabla

  const toggleCheckboxDisease = (disease: DiseaseResponse) => {
    setSelectedDiseases(
      (prev) =>
        prev.some((d) => d.diseaseId === disease.diseaseId)
          ? prev.filter((d) => d.diseaseId !== disease.diseaseId) // Deseleccionar
          : [...prev, disease] // Seleccionar
    );
  };

  // Resetea las selecciones
  const resetSelection = () => {
    setSelectedDiseases([]);
    setSelectedConfirmDiseases([]);
  };

  // Sincroniza la selección cuando se cierra el modal sin confirmar cambios
  const syncDiseasesOnClose = () => {
    setSelectedDiseases(selectedConfirmDiseases);
  };

  // Guarda la selección confirmada
  const confirmSelection = () => {
    setSelectedConfirmDiseases(selectedDiseases);
  };

  return {
    selectedDiseases,
    selectedConfirmDiseases,
    toggleCheckboxDisease,
    resetSelection,
    syncDiseasesOnClose,
    confirmSelection,
  };
};
