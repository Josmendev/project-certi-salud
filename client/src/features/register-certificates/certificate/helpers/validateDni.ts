import { showToast } from "../../../../shared/utils/toast";

// Genero validacion de dni
export const isValidDni = (dni: string) => {
  const LENGTH_DNI = 8;

  if (!dni || dni.length !== LENGTH_DNI) {
    showToast({
      title: "Ingreso de DNI",
      description: "Debes ingresar correctamente el DNI (8 dígitos)",
      type: "error",
    });
    return false;
  }
  return true;
};
