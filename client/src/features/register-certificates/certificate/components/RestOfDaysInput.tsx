import React from "react";
import { TextInput } from "../../../../shared/components/TextInput/TextInput";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RestOfDaysInput = React.forwardRef<HTMLInputElement, any>(({ ...rest }, ref) => {
  return (
    <TextInput
      label="Días de descanso"
      type="number"
      ariaLabel="Días de descanso por paciente"
      placeholder="Ingrese los días de descanso"
      ref={ref} // Ahora pasa el ref correctamente
      {...rest}
    />
  );
});
