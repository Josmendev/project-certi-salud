import { ActivateStaffService } from "../services/ActivateStaffService";
import { AssignStaffService } from "../services/AssignStaffService";
import { CreateStaffService } from "../services/CreateStaffService";
import { DeleteStaffService } from "../services/DeleteStaffService";
import { ListStaffsService } from "../services/ListStaffsService";
import { SearchStaffsService } from "../services/SearchStaffsService";
import { UpdateStaffService } from "../services/UpdateStaffService";
import type { Staff, StaffAssignRequest, StaffResponseConditional } from "../types/Staff";

//Funcion para agregar staff
export const createStaff = async ({ staff }: { staff: Staff }) => {
  const response = await CreateStaffService({ staff });

  // Controlo a persona registrado como paciente y desea pasar a trabajador
  if ("DNI" in response && response.message.endsWith("registrada como paciente")) {
    return { isPacientToAssignStaff: true, DNI: response.DNI } as StaffResponseConditional;
  }

  // Controlo a personal registrado, pero eliminado
  if ("DNI" in response && response.message.endsWith("se encuentra desactivado")) {
    return {
      isStaffDesactivated: true,
      DNI: response.DNI,
      staffId: response.staffId,
    } as StaffResponseConditional;
  }

  // Controlo a personal registrado
  if ("DNI" in response && response.message.endsWith("se encuentra registrado")) {
    return { isRegistered: true, DNI: response.DNI } as StaffResponseConditional;
  }

  return response;
};

// Funcion para obtener y buscar staffs
export const getStaffs = async ({
  limit,
  page,
  query = "",
}: {
  limit?: number;
  page: number;
  query?: string;
}) => {
  return query ? SearchStaffsService({ limit, page, query }) : ListStaffsService({ limit, page });
};

// Funcion para actualizar un staff
export const updateStaff = async ({ staff, staffId }: { staff: Staff; staffId: number }) => {
  const updatedStaff = await UpdateStaffService({ staff, staffId });
  return updatedStaff;
};

// Funcion para eliminar un staff
export const deleteStaff = async ({ staffId }: { staffId: number }) => {
  await DeleteStaffService({ staffId });
};

// Funcion para activar un staff
export const activateStaff = async ({ staffId }: { staffId: number }) => {
  await ActivateStaffService({ staffId });
};

// Funcion para asignar un staff
export const assignStaff = async ({ staff }: { staff: StaffAssignRequest }) => {
  await AssignStaffService({ staff });
};
