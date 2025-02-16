import type { AuthResponseUser } from "../../features/auth/types/authTypes";

export const getUserDetail = (user: AuthResponseUser) => {
  const name = user?.person?.name || "Nombre no disponible";
  const paternalSurname = user?.person?.paternalSurname || "";
  const maternalSurname = user?.person?.maternalSurname || "";

  const userInformation = `${name} ${paternalSurname} ${maternalSurname}`;

  return {
    name,
    paternalSurname,
    maternalSurname,
    userInformation,
  };
};
