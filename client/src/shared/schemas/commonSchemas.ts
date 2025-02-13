import { z } from "zod";

export const UsernameSchema = z
  .string()
  .nonempty("El username (DNI) no puede ser un campo vacío")
  .regex(/^\d+$/, "El username (DNI) solo debe contener números") // Solo números
  .length(8, "El username (DNI) debe tener exactamente 8 dígitos"); // Longitud exacta de 8

export const PasswordSchema = z
  .string()
  .nonempty("La contraseña no puede ser un campo vacío")
  .min(6, "La contraseña debe tener al menos 6 caracteres") // Longitud mínima de 6
  .max(16, "La contraseña debe tener como máximo 16 caracteres"); // Longitud máxima de 16

export const SecurePasswordSchema = PasswordSchema.regex(
  /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  "La contraseña debe tener al menos una mayúscula y un número"
);
