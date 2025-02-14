import { SeedPatient } from './seed-patient.interface';
import { SeedRole } from './seed-role.interface';
import { SeedStaff } from './seed-staff.interface';

export interface SeedData {
  roles: SeedRole[];
  staff: SeedStaff[];
  patients: SeedPatient[];
}
